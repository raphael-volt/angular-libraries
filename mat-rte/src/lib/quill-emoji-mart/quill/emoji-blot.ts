import { BlotData, EMOJI_MART_EMOJI, getSpanData, setElementStyles } from './emoji.module'
import Quill from 'quill'

const setSpanDataSet = (span: HTMLElement, data: BlotData) => {
    for (const k in data) {
        span.dataset[k] = String(data[k])
    }
}

const Embed = Quill.import('blots/embed')

export class QuillEmojiMartBlot extends Embed {

    static className: string = "ql-emojiblot";
    static blotName: string = 'rteemoji'
    static tagName: string = 'span'

    constructor(private span: HTMLElement, data: BlotData) {
        super(span, data)
        const child = span.querySelector('span')
        child.classList.add(EMOJI_MART_EMOJI)
        child.innerText = 'X'
        setSpanDataSet(span, data)
        setElementStyles(child, data)
    }
    
    static value(node: HTMLElement): BlotData {
        return getSpanData(node)
    }
    length() {
        return 1
    }
    
}