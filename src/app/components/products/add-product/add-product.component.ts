import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { futureDateValidator } from '../../../validators/date-validator';
import { DatePipe } from '@angular/common';
import { addYearsToDate, getFormattedDate } from 'src/app/utils/date-functions';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [DatePipe],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  startDate: string;
  dateFormat = 'dd/MM/yyyy';

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.startDate =
      datePipe.transform(
        new Date().setDate(new Date().getDate()),
        this.dateFormat
      ) || '';
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, futureDateValidator()]],
      date_revision: [
        { value: '', disabled: true },
        [Validators.required, futureDateValidator()],
      ],
    });
    this.getRevisionDateValue();
  }

  getRevisionDateValue() {
    this.productForm
      .get('date_release')
      ?.valueChanges.subscribe((initialDate) => {
        if (initialDate === 'invalid') {
          this.productForm
            .get('date_revision')
            ?.setErrors({ invalidValue: true });
        } else {
          const newDate = getFormattedDate(initialDate);
          const yearsAdded = addYearsToDate(newDate, 1);
          this.productForm
            .get('date_revision')
            ?.setValue(this.datePipe.transform(yearsAdded, 'dd/MM/yyyy'));
          this.productForm.get('date_revision')?.setErrors(null);
        }
      });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = { ...this.productForm.value };
      console.log('Adding product:', newProduct);
      this.resetForm();
    }
  }

  // Reset the form after adding a product
  resetForm(): void {
    this.productForm.reset();
  }
}
