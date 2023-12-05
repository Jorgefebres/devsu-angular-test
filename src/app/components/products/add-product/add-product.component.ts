import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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
