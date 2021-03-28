import {ErrorHandler, Injectable, NgZone} from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
  }
  // constructor(private errorDialogService: ErrorDialogService, private zone: NgZone) {}
  //
  // handleError(error: Error): void {
  //   this.zone.run(() =>
  //     this.errorDialogService.openDialog(
  //       error.message || 'Undefined client error'
  //     ));
  //
  //   console.error('Error from global error handler', error);
  // }
}
