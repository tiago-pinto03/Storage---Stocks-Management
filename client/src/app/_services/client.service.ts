import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Client } from '../_models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = environment.baseUrl;
  private registerUrl = `${this.baseUrl}/Client/register`;

  constructor(private http: HttpClient) {}

  registerClient(client: Client): Observable<any> {
    return this.http.post(this.registerUrl, client).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }

  getClientFileByNIF(nif: string): Observable<any> {
    const url = `http://localhost:5000/get/${nif}`;
    return this.http.get(url);
  }
}
