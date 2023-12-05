import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { HEADERS } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private _getHeaders(): HttpHeaders {
    return new HttpHeaders({
      [HEADERS.AUTHOR_ID]: '500',
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/bp/products`, {
      headers: this._getHeaders(),
    });
  }
}
