import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, takeUntil, throwError } from 'rxjs';
import { AddProductComponent } from './add-product.component';
import { ProductsService } from '../../../services/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    productsServiceMock = {
      getSelectedProduct: jest.fn(),
      updateProduct: jest.fn(),
      addProduct: jest.fn(),
      clearSelectedProduct: jest.fn(),
      verifyIfProductExist: jest.fn(),
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
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    component.ngOnInit();
    expect(component.productForm).toBeDefined();
  });

  it('should destroy component', () => {
    jest.spyOn(productsServiceMock, 'clearSelectedProduct');
    jest.spyOn(component.unsubscribe$, 'next');
    jest.spyOn(component.unsubscribe$, 'complete');

    component.ngOnDestroy();

    expect(productsServiceMock.clearSelectedProduct).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should initialize form with default product', () => {
    jest
      .spyOn(productsServiceMock, 'getSelectedProduct')
      .mockReturnValue(of(null));
    component.ngOnInit();
    expect(component.isEditMode).toBeFalsy();
    expect(component.selectedProduct).toEqual(component.getDefaultProduct());
  });

  it('should initialize form with selected product', () => {
    const selectedProduct = {
      id: '123',
      name: 'Test Product',
      description: 'Product Description',
      logo: 'logo.png',
      date_release: '01/01/2022',
      date_revision: '01/01/2023',
    };
    component.isEditMode = true;
    jest
      .spyOn(productsServiceMock, 'getSelectedProduct')
      .mockReturnValue(of(selectedProduct));
    component.ngOnInit();
    expect(component.isEditMode).toBeTruthy();
  });

  it('should handle product error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const updateIdErrorSpy = jest.spyOn(component, 'updateIdError');
    const throwErrorMock = throwError('Duplicate ID');

    component.handleProductError(throwErrorMock).subscribe({
      error: () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error during product operation:',
          'Duplicate ID'
        );
        expect(component.hasError).toBeTruthy();
        expect(component.isDuplicateId).toBeTruthy();
        expect(updateIdErrorSpy).toHaveBeenCalled();
      },
    });
  });

  it('should handle product error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const updateIdErrorSpy = jest.spyOn(component, 'updateIdError');
    const throwErrorMock = throwError('Duplicate ID');

    component.handleProductError(throwErrorMock).subscribe({
      error: () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error during product operation:',
          'Duplicate ID'
        );
        expect(component.hasError).toBeTruthy();
        expect(component.isDuplicateId).toBeTruthy();
        expect(updateIdErrorSpy).toHaveBeenCalled();
      },
    });
  });

  it('should handle product error when throwError is called with different error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const updateIdErrorSpy = jest.spyOn(component, 'updateIdError');
    const throwErrorMock = throwError('Some other error');

    component.handleProductError(throwErrorMock).subscribe({
      error: () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error during product operation:',
          'Some other error'
        );
        expect(component.hasError).toBeTruthy();
        expect(component.isDuplicateId).toBeFalsy();
        expect(updateIdErrorSpy).not.toHaveBeenCalled();
      },
    });
  });

  it('should handle product error when throwError is called with different error', () => {
    const error = 'Some error message';

    jest.spyOn(console, 'error');
    jest.spyOn(productsServiceMock, 'clearSelectedProduct');
    jest.spyOn(component.unsubscribe$, 'next');
    jest.spyOn(component.unsubscribe$, 'complete');
    jest
      .spyOn(productsServiceMock, 'verifyIfProductExist')
      .mockReturnValue(throwError(error));

    component
      .verifyProductExistence('123')
      .pipe(takeUntil(component.unsubscribe$))
      .subscribe(
        () => {},
        (err) => {
          expect(err).toEqual(error);
          expect(console.error).toHaveBeenCalledWith(
            'Error during product operation:',
            error
          );
          expect(component.hasError).toBeTruthy();
          expect(component.isDuplicateId).toBeFalsy();
        }
      );
  });
});
