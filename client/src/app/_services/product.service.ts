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

  getProduct2(id: string): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      catchError((error) => {
        console.log('Error retrieving product:', error);
        return throwError(error);
      })
    );
  }

  oldUpdateProduct(id?: string, product?: Product): Observable<any> {
    const updateUrl = `${this.baseUrl}/${id}`;
    return this.http.put(updateUrl, product).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
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


}
