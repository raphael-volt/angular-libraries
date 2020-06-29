import { ValidatorFn } from '@angular/forms';

const rteValidatorFn = (minLength: number): ValidatorFn => {

    return (control) => {
        const delta = control.value
        let n = 0
        if (delta) {
            let ops: any[]
            if ("ops" in delta) {
                ops = delta.ops
            }
            else {
                if (Array.isArray(delta))
                    ops = delta
            }
            if(ops) {
                for (const i of ops) {
                    if (typeof i.insert == "string") {
                        n += i.insert.replace(/\s+/g, '').length
                        continue
                    }
                    n++ // image, emoji, ...
                }
            }
        }
        let error = null
        if (n == 0) {
            error = { required: { required: true } }
        }
        else {
            if (n < minLength) {
                error = { minLength: { min: minLength, value: n } }
            }
        }
        if(error) {
            console.log("rte validation error:", n+"/"+minLength)
        }
        return error
    }
}
export { rteValidatorFn }
