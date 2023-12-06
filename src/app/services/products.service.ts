import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { HEADERS } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = environment.baseUrl;
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSubject.asObservable();

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      [HEADERS.AUTHOR_ID]: '500',
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/bp/products`, {
      headers: this.getHeaders(),
    });
  }

  verifyIfProductExist(id: string): Observable<boolean> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    return this.http.get<boolean>(`${this.apiUrl}/bp/products/verification`, {
      headers: this.getHeaders(),
      params: queryParams,
    });
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/bp/products`,
      {
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteProduct(id: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    return this.http.delete<any>(`${this.apiUrl}/bp/products`, {
      headers: this.getHeaders(),
      params: queryParams,
    });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/bp/products`,
      {
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }

  setSelectedProduct(product: Product): void {
    this.selectedProductSubject.next(product);
  }

  getSelectedProduct(): Observable<Product | null> {
    return this.selectedProductSubject.asObservable();
  }

  clearSelectedProduct(): void {
    this.selectedProductSubject.next(null);
  }
}
