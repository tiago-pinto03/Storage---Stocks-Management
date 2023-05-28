import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { Observable, BehaviorSubject, catchError, tap, throwError, of } from 'rxjs';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInEmployeeKey = 'loggedInEmployee';

  constructor(private http: HttpClient) {
    const loggedInEmployee = localStorage.getItem(this.loggedInEmployeeKey);
    if (loggedInEmployee) {
      this.loggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<Employee> {
    const loginUrl = `${this.baseUrl}/Employee/login`;

    return this.http.post<Employee>(loginUrl, { email, password }).pipe(
      tap((employee: Employee) => {
        this.storeLoggedInEmployee(employee);
        this.loggedInSubject.next(true);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  setLoggedIn(value: boolean): void {
    this.loggedInSubject.next(value);
  }

  logout(): void {
    this.removeLoggedInEmployee();
    this.loggedInSubject.next(false);
  }

  getLoggedInEmployee(): Observable<Employee | null> {
    const loggedInEmployee = this.getStoredLoggedInEmployee();
    return of(loggedInEmployee ? loggedInEmployee : null);
  }

  private storeLoggedInEmployee(employee: Employee): void {
    localStorage.setItem(this.loggedInEmployeeKey, JSON.stringify(employee));
  }

  private getStoredLoggedInEmployee(): Employee | null {
    const loggedInEmployee = localStorage.getItem(this.loggedInEmployeeKey);
    return loggedInEmployee ? JSON.parse(loggedInEmployee) : null;
  }

  private removeLoggedInEmployee(): void {
    localStorage.removeItem(this.loggedInEmployeeKey);
  }
}
