import { Injectable } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private navbarHidden: boolean;

  constructor(
    private route: ActivatedRoute
  ) { }

  shouldHideSidebar(): boolean{
    return this.navbarHidden;
  }

  toggleNavbar(): void {
    this.navbarHidden = !this.navbarHidden;
  }
}
