import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private snackBarModule: MatSnackBar
  ) { }

  showError(message: string): void{
    this.snackBarModule.open(message);
  }
}
