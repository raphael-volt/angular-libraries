import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { MatAvatarsService } from './mat-avatars.service';
import { AvatarType, isAvatarType } from './shared/mat-avatar-config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
export const AVATAR_CIRCLE_CLASS: string = "avatar-circle"
//0307060f04080a00
@Directive({
  selector: '[matAvatar]',
  host: {
    "[class]": "hostClass"
  }
})
export class MatAvatarDirective implements OnChanges {

  hostClass: string[] = ["mat-avatar"]

  @Input()
  matAvatar: string | null = null
  @Input()
  avatarType: AvatarType | null = null
  @Input()
  avatarSrc: string | SafeResourceUrl | null = null
  @Input()
  avatarCircle: boolean = false
  @Input()
  avatarSize: number = NaN
  @Input()
  avatarSizeEm: number = NaN
  @Input()
  avatarBorder: boolean = false

  private isImage: boolean = false
  private element: HTMLElement
  constructor(ref: ElementRef<HTMLElement>, private service: MatAvatarsService, private sanityze: DomSanitizer) {
    this.element = ref.nativeElement
    this.isImage = this.element.tagName.toLowerCase() == "img"
  }
  ngOnChanges(changes: SimpleChanges): void {
    const t = this.avatarType
    const a = this.matAvatar
    const el = this.element
    let avatarSrc = null
    if (isAvatarType(t) && a !== null) {
      avatarSrc = this.service.createAvatar(t, a)//this.sanityze.bypassSecurityTrustResourceUrl(this.service.createAvatar(t, a))
    }
    else {
      if(changes.avatarSrc) {
        avatarSrc = changes.avatarSrc.currentValue
        // if(avatarSrc) {
        //   avatarSrc = this.sanityze.bypassSecurityTrustResourceUrl(avatarSrc)
        // }
      }
    }
    if (avatarSrc != null) {
      if (this.isImage) {
        el.setAttribute('src', avatarSrc)
      }
      else {
        el.style.backgroundImage = `url(${avatarSrc})`
      }
    }
    let size: any = null
    let u: string = 'px'
    if (changes.avatarSizeEm) { 
      size = Number(changes.avatarSizeEm.currentValue)
      u = 'em'
    }
    if (changes.avatarSize) { 
      u = 'px'
      size = Number(changes.avatarSize.currentValue)
    }
    if (size !== null && !isNaN(size)) {
      size = `${size}${u}`
      el.style.width = size
      el.style.height = size
    }
    const cl = this.element.classList
    if (changes.avatarCircle) {
      const isCircle = changes.avatarCircle.currentValue
      this.toogleClass(isCircle, AVATAR_CIRCLE_CLASS, cl)
      
    }
    if(changes.avatarBorder) {
      const bdr = changes.avatarBorder.currentValue
      this.toogleClass(bdr, "border", cl)
    }
  }

  private toogleClass(active: boolean,name: string, cl: DOMTokenList) {
    if(active && !cl.contains(name))
      cl.add(name)
    else 
      if(! active && cl.contains(name))
        cl.remove(name)
  }
}
