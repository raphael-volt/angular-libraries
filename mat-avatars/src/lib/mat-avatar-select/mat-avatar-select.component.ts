import { Component, EventEmitter, Output } from '@angular/core';
import { MatAvatarsService } from '../mat-avatars.service';
import { AvatarDescList, AvatarDesc, Avatar } from '../shared/mat-avatars';

@Component({
  selector: 'div[avtMatAvatarSelect]',
  templateUrl: './mat-avatar-select.component.html',
  styleUrls: ['./mat-avatar-select.component.scss'],
  host: {
    class: "fx-col"
  }
})
export class MatAvatarSelectComponent {

  @Output()
  avatarChange: EventEmitter<Avatar> = new EventEmitter()
  
  selected: AvatarDesc

  collection: AvatarDescList

  rippleRadius: number

  constructor(private service: MatAvatarsService) {
    this.collection = service.avatarDescList
    this.rippleRadius = service.config.emojiSize / 2 + 5
    this.setSelected(this.collection[0])
  }

  setSelected(desc: AvatarDesc) {
    this.selected = desc
  }

}
