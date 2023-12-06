import { Component, OnInit } from '@angular/core';
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
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

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
  loading = false;
  hasError = false;
  errorCode = 0;
  errorMessage = '';
  isDuplicateId = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private productsService: ProductsService,
    private router: Router
  ) {
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
      logo: [
        'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        [Validators.required],
      ],
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
      this.loading = true;
      const newProduct: Product = {
        ...this.productForm.value,
        date_release: getFormattedDateToTime(
          this.productForm.get('date_release')?.value
        ),
        date_revision: getFormattedDateToTime(
          this.productForm.get('date_revision')?.value
        ),
      };
      this.productsService
        .verifyIfProductExist(newProduct.id)
        .pipe(
          catchError((error) => {
            console.error('Error verifyign product existence:', error);
            this.hasError = true;
            this.loading = false;
            return throwError(error);
          })
        )
        .subscribe((exists: boolean) => {
          if (!exists) {
            this.productsService
              .addProduct(newProduct)
              .pipe(
                catchError((error) => {
                  console.error('Error fetching products:', error);
                  this.hasError = true;
                  this.loading = false;
                  return throwError(error);
                })
              )
              .subscribe((product: Product) => {
                console.log('product added: ', product);
                this.loading = false;
                this.resetForm();
                this.goToProductList();
              });
          } else {
            this.loading = false;
            this.isDuplicateId = exists;
            this.updateIdError();
          }
        });
    }
  }

  private updateIdError(): void {
    const idControl = this.productForm.get('id');
    if (idControl) {
      if (this.isDuplicateId) {
        idControl.setErrors({ duplicateId: true });
      } else {
        idControl.setErrors(null);
      }
    }
  }

  goToProductList() {
    this.router.navigate(['products/product-list']);
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
