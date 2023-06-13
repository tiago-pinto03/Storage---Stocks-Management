import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../_models/employee';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.baseUrl}/Employee`;
  private registerUrl = `${this.baseUrl}/register`;

  constructor(private http: HttpClient) {}

  registerEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.registerUrl, employee);
  }

}
