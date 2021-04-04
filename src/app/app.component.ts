import { Component } from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {SharedService} from '@app/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webapp';
  darkTheme: boolean;
  hideNavbar: boolean;


  constructor(
    public authenticationService: AuthenticationService,
    public sharedService: SharedService
  ) {
  }

}
