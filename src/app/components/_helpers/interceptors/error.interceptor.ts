import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from '@app/services/authentication.service';
import {Router} from '@angular/router';
import {ToastService} from '@app/services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log(err);
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
      }
      if (err.status === 500 && err.error.message.startsWith('JWT expired')){
        this.authenticationService.logout();
      }
      else if (err.status === 500){
        this.toastService.showError(err.error.message);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
