import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product.interface';

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

  it('should get products from the API', () => {
    const mockProducts: Product[] = [
      {
        id: 'trj-crd1',
        logo: 'logo.jpg',
        name: 'nombre del producto 1',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
      {
        id: 'trj-crd2',
        logo: 'logo.jpg',
        name: 'nombre del producto 2',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
      {
        id: 'trj-crd3',
        logo: 'logo.jpg',
        name: 'nombre del producto 3',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
      {
        id: 'trj-crd4',
        logo: 'logo.jpg',
        name: 'nombre del producto 4',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
      {
        id: 'trj-crd5',
        logo: 'logo.jpg',
        name: 'nombre del producto 5',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
      {
        id: 'trj-crd6',
        logo: 'logo.jpg',
        name: 'nombre del producto 6',
        description: 'Descripción',
        date_release: '01/01/2000',
        date_revision: '01/01/2001',
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/bp/products`
    );

    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('authorId')).toEqual('500');

    req.flush(mockProducts);
  });

  it('should add a new product', () => {
    const apiUrl = `${environment.baseUrl}/bp/products`;
    const mockProduct: Product = {
      id: 'trj-test',
      name: 'Test Product',
      description: 'Product Description',
      logo: 'test_logo.jpg',
      date_release: '01/01/2023',
      date_revision: '01/01/2024',
    };

    service.addProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Author-Id')).toBe('500');

    req.flush(mockProduct);
  });
});
