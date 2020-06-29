import { Directive, ElementRef, Input } from '@angular/core';
import { QuillService } from './quill.service';

@Directive({
  selector: 'div[matRteView]',
  host: {
    class: "rte-view"
  }
})
export class MatRteViewDirective {

  private quill: any
  @Input()
  set matRteView(value: any) {
    this.quill.setContents(value)
  }
  constructor(service: QuillService, ref: ElementRef<HTMLDivElement>) { 
    this.quill = service.getViewInstance(ref.nativeElement)
  }
}
