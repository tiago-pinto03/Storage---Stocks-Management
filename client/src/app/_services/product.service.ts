import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../_models/product';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getProduct(id: string | undefined) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.baseUrl}/Product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      catchError((error) => {
        console.log('Error adding product:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(product: any) {
    const url = `${this.baseUrl}/${product.id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, product, { headers });
  }

  deleteProduct(productId: string): Observable<void> {
    const url = `${this.baseUrl}/${productId}`;
    return this.http.delete<void>(url);
  }

}
