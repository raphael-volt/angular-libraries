import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageResize, ImageResizeData } from './image-resize';

class ImageSizeValidator extends FormControl {
  private min: number
  private max: number
  constructor(private resizer: ImageResize, private axis: "width" | "height") {
    super(resizer[axis])
    this.min = resizer.minWidth
    this.max = resizer.maxWidth
    this.setValidators(this.validateRange)

  }
  public axisNext: ImageSizeValidator
  protected setInternal() {
    super.setValue(this.resizer[this.axis])
  }
  setValue(value) {
    this.resizer[this.axis] = value
    if (this.axisNext)
      this.axisNext.setInternal()
    super.setValue(value)
  }
  validateRange = (control: AbstractControl): null | ValidationErrors => {

    const error: ValidationErrors = {}
    const value = control.value
    if (typeof value == 'number' && !isNaN(value)) {
      if (value < this.min)
        error.min = true
      else
        if (value > this.max)
          error.max = true
        else
          return null
    }
    else
      error.nan = true
    console.log(error)
    return error
  }
}

@Component({
  selector: 'lib-image-resize',
  templateUrl: './image-resize.component.html',
  styleUrls: ['./image-resize.component.scss']
})
export class ImageResizeComponent implements OnDestroy {

  width: number
  height: number

  form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageResizeData,
    private ref: MatDialogRef<ImageResizeComponent, number>,
    fb: FormBuilder
  ) {

    const resize: ImageResize = this.invalidateSizeValues()

    const wv = new ImageSizeValidator(resize, "width")
    const hv = new ImageSizeValidator(resize, "height")
    wv.axisNext = hv
    hv.axisNext = wv
    const f = fb.group({
      width: wv,//[resize.width, [Validators.min(resize.minWidth), Validators.max(resize.maxWidth)]],
      height: hv//[resize.height, [Validators.min(resize.minHeight), Validators.max(resize.maxHeight)]]
    })
    this.form = f
    this.formSub = f.valueChanges.subscribe(change => {
      this.data.img.width = resize.width
    })
  }

  private get image(): HTMLImageElement {
    return this.data.img
  }
  private invalidateSizeValues() {
    const max = this.data.quill.container.width
    return new ImageResize(this.image, 50, max)
  }
  private formSub: Subscription
  ngOnDestroy(): void {
    this.formSub.unsubscribe()
  }

}
