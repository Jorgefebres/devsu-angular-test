import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './add-product.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from '../../../services/products.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let httpTestingController: HttpTestingController;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async(() => {
    productsServiceMock = {
      addProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductsService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [AddProductComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty or default values', () => {
    expect(component.productForm.value).toEqual({
      id: '',
      name: '',
      description: '',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '',
    });
  });

  it('should initialize form and subscribe to value changes', () => {
    component.ngOnInit();
    expect(component.productForm).toBeDefined();

    component.productForm.get('date_release')?.setValue('01/01/2023');
    expect(component.productForm.get('date_revision')?.value).toBe(
      '01/01/2024'
    );
  });

  it('should set the form as invalid when empty', () => {
    expect(component.productForm.valid).toBeFalsy();
  });

  it('should set the form as valid when fields are filled', () => {
    const form = component.productForm;
    form.controls['id'].setValue('Test id');
    form.controls['name'].setValue('Test Product');
    form.controls['description'].setValue('Test description');
    form.controls['logo'].setValue('Test logo');
    form.controls['date_release'].setValue('Test date_release');
    form.controls['date_revision'].setValue('Test date_revision');
    expect(form.valid).toBeTruthy();
  });

  it('should call resetForm on addProduct when form is valid', () => {
    const resetFormSpy = jest.spyOn(component, 'resetForm');
    component.productForm.setValue({
      id: 'Test id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '21/12/2023',
      date_revision: '21/12/2024',
    });
    component.addProduct();
    expect(resetFormSpy).toHaveBeenCalled();
  });

  it('should not call resetForm on addProduct when form is invalid', () => {
    const resetFormSpy = jest.spyOn(component, 'resetForm');
    component.addProduct();
    expect(resetFormSpy).not.toHaveBeenCalled();
  });

  it('should handle error when adding product', () => {
    const errorMessage = "Can't create because product is duplicate";
    productsServiceMock.addProduct.mockReturnValue(
      throwError({ error: errorMessage })
    );
    component.productForm.setValue({
      id: 'trj-crd1',
      name: 'Tarjetas de Credito',
      description: 'Tarjeta de consumo bajo la modalidad de credito',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2023-02-01T00:00:00.000+00:00',
      date_revision: '2024-02-01T00:00:00.000+00:00',
    });

    component.addProduct();

    expect(productsServiceMock.addProduct).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.hasError).toBe(true);
    expect(component.errorMessage).toBe(
      'Ya existe un producto con ese mismo Id, por favor intenta con otro'
    );
  });

  it('should reset the form on calling resetForm', () => {
    const form = component.productForm;
    form.controls['id'].setValue('Test id');
    form.controls['name'].setValue('Test Product');
    form.controls['description'].setValue('Test description');
    form.controls['logo'].setValue('Test logo');
    form.controls['date_release'].setValue('Test date_release');
    form.controls['date_revision'].setValue('Test date_revision');
    component.resetForm();
    expect(form.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
    });
  });
});
