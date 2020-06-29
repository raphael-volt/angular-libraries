import { Directive, Input, ElementRef } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EMOJI_MART_EMOJI, setElementStyles } from "./quill/emoji.module";
import { coerceNumberProperty } from '@angular/cdk/coercion';
@Directive({
  selector: '[martEmoji]',
  host: {
    "[class]": "blotClass"
  }
})
export class MartEmojiDirective {

  blotClass: string[]
  @Input()
  set martEmoji(value: string) {
    if (value) {
      const _emoji = this.service.getData(value)
      if (_emoji) {
        setElementStyles(this.element, { sheetX: _emoji.sheet[0], sheetY: _emoji.sheet[1], emoji: _emoji.id })
      }
    }
  }

  @Input()
  set emojiSize(value: number | any) {
    value = coerceNumberProperty(value)
    if (!isNaN(value)) {
      if (value < 14)
        value = 14
      else if (value > 64)
        value = 64
    }
    this.element.style.fontSize = `${value}px`
  }

  private element: HTMLElement

  constructor(
    ref: ElementRef,
    private service: EmojiService) {
    this.element = ref.nativeElement
    this.blotClass = [EMOJI_MART_EMOJI, 'mart-emoji']
  }

}
