import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {User} from '@app/components/domain/User';
import {Room} from '@app/components/domain/Room';
import {RoomService} from '@app/services/room.service';
import {Router} from '@angular/router';
import {ClipboardService} from 'ngx-clipboard';
import {ErrorService} from '@app/services/error.service';
import {AppComponent} from '@app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public currentUser: User;
  public rooms: Room[] = [];
  public maxLength = 50;
  public title: string;

  constructor(
    public authenticationService: AuthenticationService,
    private roomService: RoomService,
    private router: Router,
    private clipboardService: ClipboardService,
    private errorService: ErrorService,
    private appComponent: AppComponent
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.title = appComponent.getTitle();
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    this.roomService.getRooms()
      .subscribe(
        data => {
          console.log(data);
          this.rooms = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  navigateToCreateRoom(): void {
    this.router.navigate(['create']);
  }

  copyIdToClipboard(id: string): void {
    this.clipboardService.copy(id);
  }

  navigateToRoom(id: string): void {
    this.router.navigate(['room', id]);
  }

  deleteRoom(id: string): void {
    this.roomService.deleteRoom(id)
      .subscribe(data => {
          console.log(data);
          this.getRooms();
        },
        error => {
          this.errorService.showError(error.message);
        });
  }

  leaveRoom(id: string): void {
    this.roomService.leaveRoom(id)
      .subscribe(data => {
          console.log(data);
          this.getRooms();
        },
        error => {
          this.errorService.showError(error.message);
        });
  }
}
