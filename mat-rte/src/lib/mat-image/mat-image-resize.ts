import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Quill from "quill";
import { ImageResizeComponent } from './image-resize/image-resize.component';
import { dialogTransparentConfig } from '../dialog-transparent-config';
import { first } from 'rxjs/operators';
const Module = Quill.import('core/module')

export class MatImageResizeBlot {
}
export class MatImageResizeModule extends Module {

    private dialog: MatDialog
    static DEFAULTS = {}
    get container(): HTMLElement {
        return this.quill.container
    }
    constructor(private quill: Quill, options: any) {
        super(quill, options)
        this.dialog = options.dialog
        const toolbar = quill.getModule('toolbar')
        // disable native image resizing on firefox
        document.execCommand('enableObjectResizing', false, 'false')
        this.container.addEventListener('click', this.handleClick)
    }

    private img: HTMLImageElement

    private handleClick = (evt: MouseEvent) => {
        const target: HTMLElement = evt.target as HTMLElement
        if (target && target.tagName && target.tagName.toUpperCase() === 'IMG') {
            this.img = target as HTMLImageElement
            this.openPopup()
        }
    }

    private get dialogConfig(): MatDialogConfig {

        const er = this.quill.container.getBoundingClientRect() as DOMRect
        const offset = 4
        const r = this.img.getBoundingClientRect()
        const pos = {
            left: r.left + offset,
            top: r.top + offset
        }
        if (pos.top < er.top) {
            pos.top = er.top + offset
        }
        return {
            hasBackdrop: true,
            disableClose: false,
            backdropClass: dialogTransparentConfig.backdropClass,
            panelClass: 'mat-resize-dialog-container',
            autoFocus: true,
            restoreFocus: false,
            data: {
                img: this.img,
                quill: this.quill
            },
            position: {
                left: pos.left + "px",
                top: pos.top + "px"
            }

        }
    }

    private openPopup = () => {
        this.dialog.open<ImageResizeComponent, number>(ImageResizeComponent, this.dialogConfig)
            .afterClosed().pipe(first()).subscribe(
                () => {
                    this.quill.focus()
                }
            )
    }

}