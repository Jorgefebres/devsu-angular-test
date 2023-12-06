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
      console.log(this.productForm);
      const newProduct: Product = {
        ...this.productForm.value,
        date_release: getFormattedDateToTime(
          this.productForm.get('date_release')?.value
        ),
        date_revision: getFormattedDateToTime(
          this.productForm.get('date_revision')?.value
        ),
      };
      console.log('Adding product:', newProduct);
      this.productsService
        .addProduct(newProduct)
        .pipe(
          catchError((error) => {
            console.error('Error fetching products:', error);
            this.hasError = true;
            this.loading = false;
            if (error.error == "Can't create because product is duplicate") {
              this.errorMessage =
                'Ya existe un producto con ese mismo Id, por favor intenta con otro';
            }
            return throwError(error);
          })
        )
        .subscribe((product: Product) => {
          console.log('product added: ', product);
          this.loading = false;
          this.resetForm();
          this.goToProductList();
        });
    }
  }

  goToProductList() {
    this.router.navigate(['products/product-list']);
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
