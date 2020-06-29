import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, 
  Self, Optional, Input, ViewEncapsulation } from '@angular/core';

import { ControlValueAccessor, NgControl } from '@angular/forms';
import { QuillService } from './quill.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'div[mat-rte]',
  templateUrl: './mat-rte-component.html',
  styles: [
    './mat-rte-component.scss'
  ],
  host: {
    class: "mat-rte"
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: MatRteComponent }
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class MatRteComponent implements OnDestroy, AfterViewInit, ControlValueAccessor, MatFormFieldControl<any> {


  @ViewChild('editor')
  private editorRef: ElementRef<HTMLElement>
  @ViewChild('toolbar')
  private toolbarRef: ElementRef<HTMLElement>

  private _value: any
  get value(): any {
    return this._value
  }
  @Input()
  set value(value: any) {
    this._value = value
    this._onChange(value)
    this._onTouched(value)
    const control = this.ngControl
    if (control) {
      this.errorState = control.invalid
      this.stateChanges.next()
    }

  }

  sizes
  constructor(
    private quillService: QuillService,
    @Optional() @Self() public ngControl: NgControl) {
    this.id = "mat-rte_" + MatRteComponent._ID++
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.sizes = quillService.rteConfig.quill.toolbarSizes.filter(s => {
      if (s.name == "normal") {
        return false
      }
      return true
    })
  }
  private static _ID = 0
  stateChanges: Subject<void> = new Subject<void>();
  id: string
  describedBy = '';
  private quillModule: any
  private _placeholder: string
  get placeholder(): string {
    return this._placeholder
  }
  set placeholder(value: string) {
    if (this._placeholder == value) return
    this._placeholder = value
    if (this.quill)
      this.quill.options.placeholder = value
  }
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean = true;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string = 'mat-rte';
  autofilled?: boolean;

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    if (this.quill)
      this.quill.focus()
  }
  ngOnDestroy(): void {
    this.quill.off('text-change', this.contentChangeHandler)
  }
  writeValue(obj: any): void {
    this.content = obj
    if (this.quill)
      this.quill.setContents(obj)
  }
  private content: any

  private _onChange: (val?) => void = () => { }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  private _onTouched: (val?) => void = () => { }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
  private quill: any
  ngAfterViewInit(): void {
    const editor = this.editorRef.nativeElement
    const toolbar = this.toolbarRef.nativeElement
    const quill = this.quillService.getEditorInstance(toolbar, editor, this.placeholder)
    this.quill = quill
    if (this.content)
      quill.setContents(this.content)
    quill.on('text-change', this.contentChangeHandler)
    
  }
  private contentChangeHandler = (event) => {
    this.value = this.quill.getContents()
  }
}