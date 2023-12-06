import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { futureDateValidator } from '../../../validators/date-validator';
import { DatePipe } from '@angular/common';
import {
  addYearsToDate,
  getFormattedDate,
  getFormattedDateToTime,
} from '../../../utils/date-functions';
import { ProductsService } from '../../../services/products.service';
import { catchError, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [DatePipe],
})
export class AddProductComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  loading = false;
  hasError = false;
  isDuplicateId = false;
  isEditMode = false;
  selectedProduct: Product | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProductData();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.productsService.clearSelectedProduct();
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [
        this.selectedProduct?.id,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        this.selectedProduct?.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.selectedProduct?.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [this.selectedProduct?.logo, [Validators.required]],
      date_release: [
        this.selectedProduct?.date_release,
        [Validators.required, futureDateValidator()],
      ],
      date_revision: [
        { value: this.selectedProduct?.date_revision, disabled: true },
        [Validators.required, futureDateValidator()],
      ],
    });
    this.getRevisionDateValue();
  }

  async getProductData(): Promise<void> {
    this.productsService
      .getSelectedProduct()
      .pipe(take(1))
      .subscribe((selectedProduct) => {
        if (selectedProduct) {
          this.isEditMode = true;
          this.selectedProduct = this.transformProductDates(selectedProduct);
        } else {
          this.selectedProduct = this.getDefaultProduct();
        }
      });
  }

  getDefaultProduct(): Product {
    return {
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
  }

  transformProductDates(product: Product): Product {
    return {
      ...product,
      date_release:
        this.datePipe.transform(product?.date_release, 'dd/MM/yyyy') || '',
      date_revision:
        this.datePipe.transform(product?.date_revision, 'dd/MM/yyyy') || '',
    };
  }

  getRevisionDateValue(): void {
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

  addOrUpdateProduct(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const newProduct: Product = this.getProductFromForm();
      this.verifyProductExistence(newProduct.id)
        .pipe(
          switchMap((exists: boolean) =>
            exists && !this.isEditMode
              ? throwError('Duplicate ID')
              : this.addOrUpdate(newProduct)
          ),
          catchError((error) => this.handleProductError(error)),
          finalize(() => (this.loading = false))
        )
        .subscribe(() => this.handleSuccess());
    }
  }

  verifyProductExistence(productId: string): Observable<boolean> {
    return this.productsService.verifyIfProductExist(productId);
  }

  addOrUpdate(newProduct: Product): Observable<Product> {
    return this.isEditMode
      ? this.productsService.updateProduct(newProduct)
      : this.productsService.addProduct(newProduct);
  }

  getProductFromForm(): Product {
    return {
      ...this.productForm.value,
      date_release: getFormattedDateToTime(
        this.productForm.get('date_release')?.value
      ),
      date_revision: getFormattedDateToTime(
        this.productForm.get('date_revision')?.value
      ),
    };
  }

  handleProductError(error: any): Observable<never> {
    console.error('Error during product operation:', error);
    this.hasError = true;
    if (error === 'Duplicate ID') {
      this.isDuplicateId = true;
      this.updateIdError();
    }
    return throwError(error);
  }

  handleSuccess(): void {
    this.resetForm();
    this.goToProductList();
  }

  updateIdError(): void {
    const idControl = this.productForm.get('id');
    if (idControl) {
      idControl.setErrors({ duplicateId: true });
    }
  }

  goToProductList(): void {
    this.router.navigate(['products/product-list']);
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
