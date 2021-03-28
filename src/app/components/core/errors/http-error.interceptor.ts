import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return undefined;
  }
  // constructor(
  //   private errorDialogService: ErrorDialogService,
  //   private loadingDialogService: LoadingDialogService
  // ) {}
  //
  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   // show loading spinner
  //   this.loadingDialogService.openDialog();
  //
  //   return next.handle(request).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('Error from error interceptor', error);
  //
  //       // show dialog for error message
  //       this.errorDialogService.openDialog(error.message ?? JSON.stringify(error), error.status);
  //       return throwError(error);
  //     }),
  //     finalize(() => {
  //       // hide loading spinner
  //       this.loadingDialogService.hideDialog();
  //     })
  //   ) as Observable<HttpEvent<any>>;
  // }
}
