import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsServiceMock: Partial<ProductsService>;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    productsServiceMock = {
      getProducts: jest.fn(() => of([])),
      deleteProduct: jest.fn(() => of('')),
      setSelectedProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    component.ngOnInit();

    expect(productsServiceMock.getProducts).toHaveBeenCalled();
  });

  it('should set currentPage on onPageChange', () => {
    const newPage = 2;

    component.onPageChange(newPage);

    expect(component.currentPage).toEqual(newPage);
  });

  it('should calculate totalPages correctly', () => {
    component.products = [
      {
        id: 'trj-crd1',
        name: 'Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 'trj-crd2',
        name: 'Product 2',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 'trj-crd3',
        name: 'Product 3',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ];
    component.pageSize = 2;

    expect(component.totalPages).toBe(2);
  });

  it('should set pageSize on onMaxPageChange', () => {
    const newSize = 10;

    component.onMaxPageChange(newSize);

    expect(component.pageSize).toEqual(newSize);
  });

  it('should navigate to add-product on goToAddProduct', () => {
    component.goToAddProduct();

    expect(routerMock.navigate).toHaveBeenCalledWith(['products/add-product']);
  });

  it('should set selectedProductForDelete and show delete modal on delete action', () => {
    const product: Product = {
      id: 'trj-crd',
      name: 'Product 1',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    const event = { target: { value: 'delete' } } as any;

    component.onActionChange(event, product);

    expect(component.selectedProductForDelete).toEqual(product);
    expect(component.showDeleteModal).toBe(true);
    expect(productsServiceMock.setSelectedProduct).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should set selectedProductForDelete to undefined and show delete modal on edit action', () => {
    const product: Product = {
      id: 'trj-crd',
      name: 'Product 1',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    const event = { target: { value: 'edit' } } as any;

    component.onActionChange(event, product);

    expect(component.selectedProductForDelete).toBeNull();
    expect(component.showDeleteModal).toBe(false);
    expect(productsServiceMock.setSelectedProduct).toHaveBeenCalledWith(
      product
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['products/add-product']);
  });

  it('should delete product on deleteProduct', () => {
    const product: Product = {
      id: 'trj-crd',
      name: 'Product 1',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    component.selectedProductForDelete = product;

    component.onDeleteProduct();

    expect(productsServiceMock.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(component.selectedProductForDelete).toBeNull();
  });

  it('should cancel delete on cancelDelete', () => {
    component.cancelDelete();

    expect(component.showDeleteModal).toBe(false);
    expect(component.selectedProductForDelete).toBeNull();
  });

  it('should calculate paginatedProducts correctly', () => {
    component.products = [
      {
        id: 'trj-crd1',
        name: 'Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 'trj-crd2',
        name: 'Product 2',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 'trj-crd3',
        name: 'Product 3',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ];
    component.pageSize = 2;
    component.currentPage = 2;
    component.searchTerm = 'Product';

    const paginatedProducts = component.paginatedProducts;

    expect(paginatedProducts).toEqual([
      {
        id: 'trj-crd3',
        name: 'Product 3',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ]);
  });
});
