import { Component, Optional, EventEmitter, ElementRef, ViewChild, Output, Inject } from '@angular/core';
import { EmojiEvent, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRteConfig, MAT_RTE_CONFIG_TOKEN } from '../../mart-emoji.config';
export type EmojiDialogPickerRef = MatDialogRef<EmojiDialogPickerComponent, EmojiData>

@Component({
  selector: 'emoji-dialog-picker',
  templateUrl: './emoji-dialog-picker.component.html',
  styleUrls: ['./emoji-dialog-picker.component.css']
})
export class EmojiDialogPickerComponent {

  @ViewChild('main')
  mainRef: ElementRef<HTMLElement>

  in18n = {
    categories: {
      people: 'Smileys & Personnes',
      nature: 'Animaux & Nature',
      foods: 'Nourriture & Boissons',
      activity: 'Activités',
      places: 'Voyages & Lieux',
      objects: 'Objets',
      symbols: 'Symboles',
      flags: 'Drapeaux'
    }
  }
  backgroundImageFn: (...args) => string

  sheetSize: number

  @Output()
  emojiClick: EventEmitter<EmojiData> = new EventEmitter()
  @Output()
  sizeChange: EventEmitter<number[]> = new EventEmitter()

  constructor(
    @Inject(MAT_RTE_CONFIG_TOKEN) rteConfig: MatRteConfig,
    @Optional() private dialogRef: MatDialogRef<EmojiDialogPickerComponent, EmojiData>,
    private elementRef: ElementRef<HTMLElement>) {
    this.backgroundImageFn = rteConfig.emoji.backgroundImageFn
    this.sheetSize = rteConfig.emoji.sheetSize
  }

  emojiClickHandler(event: EmojiEvent) {
    const emoji = event.emoji
    const dialogRef = this.dialogRef
    if (dialogRef)
      return dialogRef.close(emoji)
    this.emojiClick.emit(emoji)
  }

  get bounds(): [number, number] {
    if (!this.mainRef) return [0, 0]
    const element = this.mainRef.nativeElement
    return [element.offsetWidth, element.offsetHeight]
  }
}
