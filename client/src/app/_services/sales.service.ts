import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Sales } from '../_models/sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl = `${environment.baseUrl}/Sales`;

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sales[]> {
    return this.http.get<Sales[]>(this.baseUrl);
  }

  addSale(sales: Sales): Observable<Sales> {
    return this.http.post<Sales>(this.baseUrl, sales).pipe(
      catchError((error) => {
        console.log('Error adding sales:', error);
        return throwError(error);
      })
    );
  }

  updateSales(sales: any) {
    const url = `${this.baseUrl}/${sales.id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, sales, { headers });
  }

  deleteSale(saleId: string): Observable<void> {
    const url = `${this.baseUrl}/${saleId}`;
    return this.http.delete<void>(url);
  }
}
