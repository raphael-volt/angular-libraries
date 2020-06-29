import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { Avatar } from './mat-avatars';
import { MatAvatarsService } from '../mat-avatars.service';

@Directive({
  selector: '[avatarImg]'
})
export class AvatarImgDirective {

  private img: HTMLElement
  
  @Input()
  set disabled(value: boolean) {
    const v = "disabled"
    const cl = this.img.classList
    if (value)
      if (!cl.contains(v))
        cl.add(v)
      else {
        if (cl.contains(v))
          cl.remove(v)
      }
  }

  private _selected: boolean = false
  get selected(): boolean {
    return this._selected
  }
  @Input()
  set selected(value: boolean) {
    if (this._selected == value) return
    this._selected = value
    const v = "selected"
    const cl = this.img.classList
    if (value) {
      if (!cl.contains(v))
        cl.add(v)
    }
    else
      if (cl.contains(v))
        cl.remove(v)
  }

  @HostListener('click')
  clickHandler() {
    if (this.disabled) return // 
    this.service.selectDirective(this)
  }

  constructor(ref: ElementRef<HTMLImageElement>, private service: MatAvatarsService) {
    this.img = ref.nativeElement
  }

  setPosition(x: number, y: number) {
    const s = this.img.style
    const u = 'px'
    s.left = x+u
    s.top = y+u
  }

}
