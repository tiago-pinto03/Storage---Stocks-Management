import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../_models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.baseUrl}/Category`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  editCategory(id: string, updatedCategory: Category): Observable<Category> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Category>(url, updatedCategory).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }

  createCategory(newCategory: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, newCategory).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }
}
