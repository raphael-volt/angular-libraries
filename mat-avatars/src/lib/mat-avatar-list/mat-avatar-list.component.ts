import { Component, Output, Input, OnChanges, SimpleChanges, ElementRef, AfterViewInit, OnDestroy, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { AvatarType } from '../shared/mat-avatar-config';
import { Avatar } from '../shared/mat-avatars';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatAvatarsService } from '../mat-avatars.service';
import { AvatarImgDirective } from '../shared/avatar-img.directive';


@Component({
  selector: 'div[avtMatAvatarList]',
  templateUrl: './mat-avatar-list.component.html',
  styleUrls: ['./mat-avatar-list.component.scss'],
  host: {
    "class": "mat-avatar-list"
  }
})
export class MatAvatarListComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Output()
  avatarChange: EventEmitter<Avatar> = new EventEmitter()
  @Input()
  avatarType: AvatarType

  avatars: BehaviorSubject<Avatar[]> = new BehaviorSubject([])

  @ViewChildren(AvatarImgDirective)
  images: QueryList<AvatarImgDirective>

  avatarSize: number
  rippleRadius: number
  private element: HTMLDivElement

  constructor(ref: ElementRef<HTMLDivElement>, private service: MatAvatarsService) {
    this.element = ref.nativeElement
    this.avatarSize = service.config.previewSize
    this.rippleRadius = service.config.previewSize / 2
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler)
    if (this.imgSub)
      this.imgSub.unsubscribe()
  }
  private imgSub: Subscription
  ngAfterViewInit(): void {
    this.imgSub = this.images.changes.subscribe(value => {
      this.updatePosition()
    })
    this.validateSize()
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
  }

  private updatePosition() {
    this.service.setAvatarsPosition(this.images.toArray(), ...this.sizes)
  }
  private sizes: [number, number] = [0, 0]
  private validateSize() {
    const prev = this.sizes.slice()
    const s = this.sizes
    const e = this.element
    s[0] = Math.floor(e.clientWidth)
    s[1] = Math.floor(e.clientHeight)
    return (s[0] != prev[0] || s[1] != prev[1])
  }
  private resizeHandler = (event = null) => {
    this.validateSize()
    const avatars = this.avatars.getValue()
    if (this.service.checkAvatars(this.avatarType, avatars, 8, 8, ...this.sizes)) {
      if (this.selected) {
        if (avatars.indexOf(this.selected) < 0) {
          this.selected = null
          this.avatarChange.next(null)
        }
      }
      this.avatars.next(avatars)
    }
    else {
      this.updatePosition()
    }
  }

  refresh() {
    setTimeout(() => this.setAvatarType(this.avatarType))
  }

  private setAvatarType(type: AvatarType) {
    if (this.selected) {
      this.selected = null
      this.avatarChange.next(null)
    }
    this.validateSize()
    this.service.clearSelection()
    this.avatars.next(this.service.getAvatars(type, ...this.sizes))
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarType) {
      this.setAvatarType(changes.avatarType.currentValue)
    }
  }
  private selected: Avatar
  setSelected(avatar: Avatar) {
    this.selected = avatar
    this.avatarChange.next(avatar)
  }

  ngOnInit(): void {
  }

}
