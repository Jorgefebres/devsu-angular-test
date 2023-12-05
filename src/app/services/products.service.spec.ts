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

  it('should retrieve products from the API', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        logo: 'logo.jpg',
        name: 'nombre del producto 1',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
      },
      {
        id: 2,
        logo: 'logo.jpg',
        name: 'nombre del producto 2',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
      },
      {
        id: 3,
        logo: 'logo.jpg',
        name: 'nombre del producto 3',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
      },
      {
        id: 4,
        logo: 'logo.jpg',
        name: 'nombre del producto 4',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
      },
      {
        id: 5,
        logo: 'logo.jpg',
        name: 'nombre del producto 5',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
      },
      {
        id: 6,
        logo: 'logo.jpg',
        name: 'nombre del producto 6',
        description: 'Descripción',
        releaseDate: '01/01/2000',
        revisionDate: '01/01/2001',
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
});
