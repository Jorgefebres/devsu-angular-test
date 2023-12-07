import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../interfaces/product.interface';
import { HttpHeaders, HttpParams } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return headers with author id', () => {
    const headers = service.getHeaders();
    expect(headers.get('authorId')).toEqual('500');
  });

  it('should get products', () => {
    const mockProducts: Product[] = [
      {
        id: 'trj-test1',
        name: 'Product 1',
        description: 'tarjeta de credito test',
        logo: 'logo-test',
        date_release: '',
        date_revision: '',
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(
      `${service.apiUrl}/bp/products`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockProducts);
  });

  it('should verify if product exists', () => {
    const productId = '1';
    const mockExistence = true;

    service.verifyIfProductExist(productId).subscribe((exists) => {
      expect(exists).toEqual(mockExistence);
    });

    const req = httpTestingController.expectOne(
      `${service.apiUrl}/bp/products/verification?id=${productId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockExistence);
  });

  it('should add product', () => {
    const mockProduct: Product = {
      id: 'trj-test1',
      name: 'Product 1',
      description: 'tarjeta de credito test',
      logo: 'logo-test',
      date_release: '',
      date_revision: '',
    };

    service.addProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(
      `${service.apiUrl}/bp/products`
    );
    expect(req.request.method).toEqual('POST');
    req.flush(mockProduct);
  });

  it('should delete product', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe();

    const req = httpTestingController.expectOne(
      `${service.apiUrl}/bp/products?id=${productId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should update product', () => {
    const mockProduct: Product = {
      id: 'trj-test1',
      name: 'Product 1',
      description: 'tarjeta de credito test',
      logo: 'logo-test',
      date_release: '',
      date_revision: '',
    };

    service.updateProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(
      `${service.apiUrl}/bp/products`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(mockProduct);
  });
});
