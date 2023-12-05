import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let router: Router;

  beforeEach(() => {
    productsServiceMock = {
      getProducts: jest.fn(),
    } as unknown as jest.Mocked<ProductsService>;

    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ProductsService, useValue: productsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on ngOnInit', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ];
    productsServiceMock.getProducts.mockReturnValue(of(mockProducts));

    component.ngOnInit();

    expect(productsServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should calculate totalPages correctly', () => {
    component.products = [
      {
        id: 1,
        name: 'Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 2,
        name: 'Product 2',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 3,
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

  it('should navigate to "products/add-product" on onAddNewProduct', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onAddNewProduct();

    expect(navigateSpy).toHaveBeenCalledWith(['products/add-product']);
  });

  it('should update currentPage on onPageChange', () => {
    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
  });

  it('should calculate paginatedProducts correctly', () => {
    component.products = [
      {
        id: 1,
        name: 'Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 2,
        name: 'Product 2',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: 3,
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
        id: 3,
        name: 'Product 3',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ]);
  });
});
