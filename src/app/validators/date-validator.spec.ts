import { AbstractControl, FormControl } from '@angular/forms';
import { futureDateValidator } from './date-validator';

describe('futureDateValidator', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null for null control value', () => {
    control.setValue(null);
    const result = futureDateValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for empty string control value', () => {
    control.setValue('');
    const result = futureDateValidator()(control);
    expect(result).toBeNull();
  });

  it('should return true for a future date', () => {
    // suponiendo q hoy es 2023-12-06
    const futureDate = '2023-12-07';
    control.setValue(futureDate);
    const result = futureDateValidator()(control);
    expect(result).toBeTruthy();
  });

  it('should return futureDate error for a past date', () => {
    // suponiendo q hoy es 2023-12-06
    const pastDate = '2022-12-06';
    control.setValue(pastDate);
    const result = futureDateValidator()(control);
    expect(result).toEqual({ futureDate: true });
  });

  it('should return futureDate error for the current date', () => {
    // suponiendo q hoy es 2023-12-06
    const currentDate = '2023-12-06';
    control.setValue(currentDate);
    const result = futureDateValidator()(control);
    expect(result).toEqual({ futureDate: true });
  });
});
