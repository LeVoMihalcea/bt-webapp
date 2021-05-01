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
  private title = 'bt-webapp';
  darkTheme: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    public sharedService: SharedService,
  ) {}

  ngOnInit(): void {
  }

  getTitle(): string {
    return this.title;
  }
}
