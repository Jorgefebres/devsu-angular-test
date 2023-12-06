import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const dateParts = control.value.split('/');

    const inputDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    const currentDate = new Date();

    if (inputDate < currentDate) {
      return { futureDate: true };
    }
    return null;
  };
}
