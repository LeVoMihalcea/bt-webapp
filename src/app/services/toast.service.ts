import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSnackBarHorizontalPosition} from "@angular/material/snack-bar/snack-bar-config";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBarModule: MatSnackBar
  ) { }

  showError(message: string): void{
    this.snackBarModule.open(message, 'X', {
      duration: 5000,
      panelClass: 'error-toast',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showInfo(message: string): void{
    this.snackBarModule.open(message, 'X', {
      duration: 5000,
      panelClass: 'info-toast',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showOkay(message: string): void{
    this.snackBarModule.open(message, 'X', {
      duration: 5000,
      panelClass: 'success-toast',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}
