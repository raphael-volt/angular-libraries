import { Injectable, Inject } from '@angular/core';
import Quill from 'quill';
import { MatImageResizeModule } from './mat-image/mat-image-resize';
import { MatDialog } from '@angular/material/dialog';
import { QuillEmojiMartToolbar } from './quill-emoji-mart/quill/emoji-toolbar';
import { QuillEmojiMartBlot } from './quill-emoji-mart/quill/emoji-blot';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Overlay } from '@angular/cdk/overlay';
import { EMOJI_OPTIONS } from "./quill-emoji-mart/quill/emoji.module";
import { MAT_RTE_CONFIG_TOKEN, MatRteConfig, DEFAULT_MAT_RTE_CONFIG } from './mart-emoji.config';
const checkConfig = (config) => {
  if (config) {
    let cfg = DEFAULT_MAT_RTE_CONFIG
    if (!config.emoji) {
      config.emoji = cfg.emoji
    }
    else {
      if (!config.emoji.backgroundImageFn) {
        config.emoji.backgroundImageFn = cfg.emoji.backgroundImageFn
      }
    }
    if (!config.quill)
      config.quill = cfg.quill
  }
  return config
}

@Injectable({
  providedIn: 'root'
})
export class QuillService {

  constructor(
    @Inject(MAT_RTE_CONFIG_TOKEN) public rteConfig: MatRteConfig,
    public dialog: MatDialog,
    public emoji: EmojiService,
    public overlay: Overlay) {
    EMOJI_OPTIONS.emoji = emoji
    EMOJI_OPTIONS.overlay = overlay
    this.initQuill()
    checkConfig(rteConfig)
  }




  private initQuill() {
    Quill.register('formats/rteemoji', QuillEmojiMartBlot)
    Quill.register('modules/rteemoji', QuillEmojiMartToolbar)
    var Block = Quill.import('blots/block')
    Block.tagName = 'div'
    Quill.register(Block)
    Quill.register('modules/matImageResize', MatImageResizeModule)
    const Size = Quill.import('attributors/style/size')
    Size.whitelist = this.rteConfig.quill.toolbarSizes.map(s => s.size)
    Quill.register(Size, true)


  }

  getViewInstance(element: HTMLElement) {
    return new Quill(element, {
      theme: 'snow',
      rteemoji: {},
      readOnly: true,
      modules: {
        toolbar: false,
        rteemoji: {
          emoji: this.emoji
        }
      }
    })
  }
  getEditorInstance(toolbar: HTMLElement, editor: HTMLElement, placeHolder: string = null): any {
    const dialog = this.dialog
    const overlay = this.overlay
    const quill = new Quill(editor, {
      placeHolder,
      theme: 'snow',
      modules: {
        rteemoji: {
          emoji: this.emoji,
          overlay,
          editor
        },
        matImageResize: {
          dialog: dialog
        },
        toolbar: {
          container: toolbar,
          handlers: {
            link: function link(value) {
              const quill = this.quill
              if (value) {
                let range = quill.getSelection();
                if (range == null || range.length == 0) return;
                let preview = quill.getText(range.index);
                if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
                  preview = 'mailto:' + preview;
                }
                let tooltip = quill.theme.tooltip;
                tooltip.boundsContainer = tooltip.quill.root
                tooltip.edit()
                tooltip.textbox.setAttribute('placeholder', '');
              } else {
                quill.format('link', false);
              }
            }

          }
        }
      }
    })
    return quill
  }
}

