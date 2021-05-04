import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from '@app/services/authentication.service';
import {Router} from '@angular/router';
import {ErrorService} from '@app/services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private errorService: ErrorService
  ) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log(err);
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }
      if (err.status === 500 && err.error.message.startsWith('JWT expired')){
        this.authenticationService.logout();
      }
      else if (err.status === 500){
        this.errorService.showError(err.error.message);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
