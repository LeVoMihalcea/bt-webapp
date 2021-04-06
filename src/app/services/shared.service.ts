import { Injectable } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private navbarHidden: boolean;
  private roomIdSource = new BehaviorSubject('');
  currentMessage = this.roomIdSource.asObservable();

  constructor(
    private route: ActivatedRoute
  ) { }

  shouldHideSidebar(): boolean{
    return this.navbarHidden;
  }

  toggleNavbar(): void {
    this.navbarHidden = !this.navbarHidden;
  }

  changeRoomId(roomId: string): void{
    this.roomIdSource.next(roomId);
  }
}
