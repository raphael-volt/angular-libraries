import { EmojiData, EmojiService, emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { Overlay } from '@angular/cdk/overlay';

export const EMOJI_MART_EMOJI = "rte-mart-emoji"

export const backgroundImageFn = (...args): string => {
    return `assets/emoji-apple-64.png`
}
export type QuillEmojiMartOptions = {
    emoji?: EmojiService
    overlay?: Overlay
    editor?: HTMLElement
}

export const EMOJI_OPTIONS: QuillEmojiMartOptions = {}
export const getBlotData = (emoji: EmojiData): BlotData => {
    return {
        sheetX: emoji.sheet[0],
        sheetY: emoji.sheet[1],
        emoji: emoji.id
    }
}
export const isEmojiElement = (value: HTMLElement) => {
    return value.querySelector("span." + EMOJI_MART_EMOJI)
}
export const getSpanData = (span: HTMLElement): BlotData => {
    return {
        sheetX: +span.dataset.sheetX,
        sheetY: +span.dataset.sheetY,
        emoji: span.dataset.emoji
    }
}
export type SheetSize = 16 | 20 | 32 | 64
export const getSheetSize = (size): SheetSize => {
    let sz: 16 | 20 | 32 | 64 = 16
    if (size > 16) {
        sz = 20
        if (size >= 32)
            sz = 64
        else {
            if (size >= 20)
                sz = 32
        }
    }
    return sz
}
export const setSpanDataSet = (span: HTMLElement, data: BlotData) => {
    for (const k in data)
        span.dataset[k] = String(data[k])
}
export const getBlotStyles = (data: BlotData, service?: EmojiService) => {
    if (!service)
        service = EMOJI_OPTIONS.emoji
    const sheetSize = 64
    const styles = service.emojiSpriteStyles([data.sheetX, data.sheetY], "apple", sheetSize, sheetSize, 57, backgroundImageFn)
    return styles
}
export type BlotData = {
    sheetX: number,
    sheetY: number,
    emoji: string
}
const getSpritePosition = (sheetX: number, sheetY: number, sheetColumns: number = 57) => {
    const multiply = 100 / (sheetColumns - 1);
    return `${multiply * sheetX}% ${multiply * sheetY}%`;
}
export const setElementStyles = (
    element: HTMLElement,
    data: BlotData): void => {
    element.style.backgroundPosition = getSpritePosition(data.sheetX, data.sheetY)
}

