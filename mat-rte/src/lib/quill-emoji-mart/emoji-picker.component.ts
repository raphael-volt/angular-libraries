import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PickerComponent, EmojiFrequentlyService } from '@ctrl/ngx-emoji-mart';
import { EmojiCategory } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiPickerService } from './emoji-picker.service';

@Component({
    selector: 'emoji-picker',
    templateUrl: './emoji-picker.component.html'
})
export class EmojiPickerComponent extends PickerComponent {
    @Output()
    categoryChange: EventEmitter<EmojiCategory> = new EventEmitter()

    @Output()
    sizeChange: EventEmitter<number[]> = new EventEmitter()

    private size: number[] = [0, 0]
    
    constructor(
        private pickerService: EmojiPickerService,
        private cdr: ChangeDetectorRef,
        frequently: EmojiFrequentlyService,
    ) {
        super(cdr, frequently)
    }

    ngOnInit() {
        super.ngOnInit()
        const ps = this.pickerService
        if (ps.selectedCategory) {

            this.selected = ps.selectedCategory.name
            this.cdr.detectChanges()
        }
    }

    updateCategoriesSize() {
        super.updateCategoriesSize()
        const w = parseFloat(this.getWidth())
        const h = this.clientHeight
        const s = this.size
        if(s[0] != w || s[1] != h) {
            s[0] = w 
            s[1] = h
            this.sizeChange.emit(s.slice())
        }
    }

    handleAnchorClick($event: { category: EmojiCategory; index: number }) {

        const prev = this.selected
        super.handleAnchorClick($event)
        if (prev != this.selected) {
            this.pickerService.selectedCategory = $event.category
            this.categoryChange.emit($event.category)
        }
    }
}