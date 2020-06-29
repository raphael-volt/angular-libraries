import { Subject } from 'rxjs'

type ImgResizeAxis = "width" | "height"
export class ImageResize {

    change: Subject<void> = new Subject()

    private _width: number
    get width(): number {
        return this._width
    }

    set width(value: number) {
        this.setSize(value)
        this.validateValues()
    }

    private _height: number
    get height(): number {
        return this._height
    }
    set height(value: number) {
        this.width = this.calculateWidth(value)
    }
    get naturalWidth() {
        return this.img.naturalWidth
    }

    get naturalHeight() {
        return this.img.naturalHeight
    }

    private _maxHeight: number
    get maxHeight(): number {
        return this._maxHeight
    }

    private _minHeight: number
    get minHeight(): number {
        return this._minHeight
    }

    constructor(
        private img: Partial<HTMLImageElement>,
        public readonly minWidth: number,
        public readonly maxWidth: number) {

        this.setSize(img.width)
        this._maxHeight = this.calculateHeight(this.maxWidth)
        this._minHeight = this.calculateHeight(this.minWidth)
        this.validateValues(false)
    }
    private validateValues(notify: boolean = true) {
        const old: number = this._width
        if (old < this.minWidth)
            this.setSize(this.minWidth)
        else
            if (old > this.maxWidth)
                this.setSize(this.maxWidth)
        if (old != this._width) {
            const sub = this.change
            if (notify && sub.observers.length)
                sub.next()
            return true
        }
        return false
    }
    private setSize(width: number, height: number = NaN) {
        this._width = width
        if (isNaN(height))
            height = this.calculateHeight(width)
        this._height = height
    }
    private calculateHeight(width) {
        return (width / this.naturalWidth) * this.naturalHeight
    }
    private calculateWidth(height) {
        return (height / this.naturalHeight) * this.naturalWidth
    }

}

export type ImageResizeData = {
    img: HTMLImageElement
    quill: any
  }