import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { DateValidators } from '../../../validators/date-validator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
      ],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ]),
      ],
      logo: ['', Validators.required],
      date_release: [
        '',
        Validators.compose([
          Validators.required,
          DateValidators.greaterThan(new Date()),
        ]),
      ],
      date_revision: [
        '',
        Validators.compose([
          Validators.required,
          DateValidators.greaterThan(new Date()),
        ]),
      ],
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
