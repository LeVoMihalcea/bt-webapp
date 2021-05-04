import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBarModule: MatSnackBar
  ) { }

  showError(message: string): void{
    this.snackBarModule.open(message, 'x', {
      duration: 5000,
      panelClass: 'error-toast'
    });
  }

  showInfo(message: string): void{
    this.snackBarModule.open(message, 'x', {
      duration: 5000,
      panelClass: 'info-toast'
    });
  }

  showOkay(message: string): void{
    this.snackBarModule.open(message, 'x', {
      duration: 5000,
      panelClass: 'success-toast'
    });
  }
}
