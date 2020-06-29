import { Injectable } from '@angular/core';
import { EmojiCategory } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Injectable({
  providedIn: 'root'
})
export class EmojiPickerService {

  selectedCategory: EmojiCategory
}

