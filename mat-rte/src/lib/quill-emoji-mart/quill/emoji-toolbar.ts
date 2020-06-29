import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiDialogPickerComponent } from "../emoji-dialog-picker/emoji-dialog-picker.component";
import Quill from 'quill'
import { dialogTransparentConfig } from '../../dialog-transparent-config';
import { Subscription } from 'rxjs';
import { QuillEmojiMartOptions } from "./emoji.module";
import { getBlotData } from "./emoji.module";
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef, OverlayConfig } from '@angular/cdk/overlay';

const Embed = Quill.import('blots/embed') as {
    new(node, value): Object

};
const Module = Quill.import('core/module')


export class QuillEmojiMartToolbar extends Module {

    static DEFAULTS = {}

    private range: { index: number, length: number }
    private format: any

    private _pickerPortal: ComponentPortal<EmojiDialogPickerComponent>
    private _overlayRef: OverlayRef
    private sizeSub: Subscription
    private bgSub: Subscription
    private emojiSub: Subscription

    constructor(public quill: any, private options: QuillEmojiMartOptions) {
        super(quill, options)
        if (options.overlay) {

            const toolbar = quill.getModule('toolbar')
            toolbar.addHandler('rteemoji', this.openDialog)

            quill.keyboard.addBinding({
                key: 'E',
                ctrlKey: true
            } as any, (range) => {
                this.openDialog()
            })
        }
    }

    private openDialog = (): void => {
        const _oRef = this.checkOverlay()

        const quill = this.quill
        const range = quill.getSelection()

        this.format = quill.getFormat(range)
        const bounds = quill.getBounds(range.index)

        this.range = range
        const positionStrategy = this.options.overlay.position().flexibleConnectedTo(this.options.editor)
            .withPositions([
                {
                    weight: 10,
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                    offsetX: bounds.left,
                    offsetY: bounds.top
                },
                {
                    weight: 9,
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'top',
                    offsetX: bounds.left,
                    offsetY: bounds.top
                },
                {
                    weight: 8,
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'bottom',
                    offsetX: bounds.left
                },
                {
                    weight: 7,
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'bottom',
                    offsetX: bounds.left
                },
                {
                    weight: 6,
                    originX: 'center',
                    originY: 'center',
                    overlayX: 'center',
                    overlayY: 'center'
                },

            ])
            .withFlexibleDimensions(false)
            .withPush(true)
        _oRef.updatePositionStrategy(positionStrategy)

        const ref = _oRef.attach(this._pickerPortal)

        this.emojiSub = ref.instance.emojiClick.subscribe(this.close)
        this.sizeSub = ref.instance.sizeChange.subscribe(() => {
            _oRef.updatePosition()
        })
        this.bgSub = _oRef.backdropClick().subscribe(_ => {
            this.close()
        })
    }

    private close = (emoji: EmojiData = null): void => {

        if (this.bgSub)
            this.bgSub.unsubscribe()
        if (this.sizeSub)
            this.sizeSub.unsubscribe()
        if (this.emojiSub)
            this.emojiSub.unsubscribe()
        if (this._overlayRef.hasAttached())
            this._overlayRef.detach()

        const quill = this.quill
        quill.focus()
        const range = this.range
        const index = range.index
        if (emoji) {
            const format = this.format
            quill.insertEmbed(range.index, 'rteemoji', getBlotData(emoji))
            quill.setSelection(index, 1, "api")
            for (const k in format)
                quill.format(k, format[k])
            quill.setSelection(index + 1, 0, "api")
        }
    }

    private checkOverlay() {
        if (!this._overlayRef) {
            const overlay = this.options.overlay
            const cfg: OverlayConfig = {
                panelClass: dialogTransparentConfig.panelClass,
                backdropClass: dialogTransparentConfig.backdropClass,
                hasBackdrop: true,
                scrollStrategy: overlay.scrollStrategies.block()
            }
            this._overlayRef = this.options.overlay.create(cfg)

            this._pickerPortal = new ComponentPortal(EmojiDialogPickerComponent)
        }
        return this._overlayRef
    }


}