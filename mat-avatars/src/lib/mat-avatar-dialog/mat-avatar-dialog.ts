import { Component, Optional, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '../shared/mat-avatars';

@Component({
  selector: 'avt-mat-avatar-dialog',
  templateUrl: './mat-avatar-dialog.html',
  styleUrls: ['./mat-avatar-dialog.scss'],
  host: {
    class: 'fx-col fx1'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatAvatarDialog {
  selected: Avatar
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private dialogRef: MatDialogRef<MatAvatarDialog, Avatar>) {
  }

  avatarChange(avatar) {
    this.selected = avatar
    this.cdr.detectChanges()
  }
}
