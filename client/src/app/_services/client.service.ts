import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Client } from '../_models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = environment.baseUrl;
  private registerUrl = `${this.baseUrl}/Client/register`;
  private getUrl = `${this.baseUrl}/Client`;

  constructor(private http: HttpClient) {}

  registerClient(client: Client): Observable<any> {
    return this.http.post(this.registerUrl, client).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }

  getClients(token: string): Observable<Client[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Client[]>(this.getUrl, { headers });
  }

  getClientFileByNIF(nif: string): Observable<any> {
    const url = `http://localhost:5000/get/${nif}`;
    return this.http.get(url);
  }

  updateClient(nif: string, client: Client): Observable<any> {
    const updateUrl = `http://localhost:5000/api/ClientFile/${nif}`;
    return this.http.put(updateUrl, client).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError(error);
      })
    );
  }
}
