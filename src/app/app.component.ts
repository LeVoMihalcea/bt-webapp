import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {SharedService} from '@app/services/shared.service';
import {Subscription} from 'rxjs';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webapp';
  darkTheme: boolean;
  hideNavbar: boolean;
  roomId: string;
  room: Room;

  subscription: Subscription;

  constructor(
    public authenticationService: AuthenticationService,
    public sharedService: SharedService,
    public roomService: RoomService
  ) {
    this.room = new Room('', '', '');
  }

  ngOnInit(): void {
    this.subscription = this.sharedService.currentMessage.subscribe(roomId => {
      // if (roomId.length !== 0 && this.authenticationService.currentUserValue.email.length !== 0) {
      //   this.roomService.getRoomById(roomId).subscribe(
      //     room => this.room = room
      //   );
      // }
    });
  }

}
