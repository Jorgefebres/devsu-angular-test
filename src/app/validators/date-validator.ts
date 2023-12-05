import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class DateValidators {
  static greaterThan(initialDate: Date): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const startDate: Date = initialDate;
      const endDate: Date = endControl.value;
      if (!startDate || !endDate) {
        return null;
      }
      if (startDate >= endDate) {
        return { greaterThan: true };
      }
      return null;
    };
  }
  static LessThanToday(control: FormControl): ValidationErrors | null {
    let today: Date = new Date();

    if (new Date(control.value) > today) return { LessThanToday: true };

    return null;
  }
}
