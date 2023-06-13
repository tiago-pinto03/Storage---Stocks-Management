import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user;
    if (localStorage.getItem('loggedInEmployee'))
     user = JSON.parse(localStorage.getItem('loggedInEmployee') || '');

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${user?.token}`
      }
    });

    return next.handle(authRequest);
  }
}

