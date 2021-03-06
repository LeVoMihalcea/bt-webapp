import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {User} from '@app/components/domain/User';
import {Room} from '@app/components/domain/Room';
import {RoomService} from '@app/services/room.service';
import {Router} from '@angular/router';
import {ClipboardService} from 'ngx-clipboard';
import {ToastService} from '@app/services/toast.service';
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
  loading: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    private roomService: RoomService,
    private router: Router,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    public appComponent: AppComponent
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.title = appComponent.getTitle();
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    this.loading = true;
    this.roomService.getRooms()
      .subscribe(
        data => {
          this.rooms = data;
          this.loading = false;
        },
        error => {
        }
      );
  }

  navigateToCreateRoom(): void {
    this.router.navigate(['create']);
  }

  copyIdToClipboard(id: string): void {
    this.toastService.showInfo('Join Code copied to clipboard');
    this.clipboardService.copy(id);
  }

  navigateToRoom(id: string): void {
    this.router.navigate(['room', id]);
  }

  deleteRoom(id: string): void {
    this.roomService.deleteRoom(id)
      .subscribe(data => {
          this.getRooms();
        },
        error => {
          this.toastService.showError(error.message);
        });
  }

  leaveRoom(id: string): void {
    this.roomService.leaveRoom(id)
      .subscribe(data => {
          this.getRooms();
        },
        error => {
          this.toastService.showError(error.message);
        });
  }
}
