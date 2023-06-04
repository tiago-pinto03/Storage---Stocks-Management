import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Supplier } from '../_models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = `${environment.baseUrl}/Supplier`;

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.baseUrl);
  }

  editSupplier(id: string, updatedSupplier: Supplier): Observable<Supplier> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Supplier>(url, updatedSupplier).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }
}
