import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {Router} from '@angular/router';
import {environment} from '@environments/environment';
import {AppComponent} from '@app/app.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    public authenticationService: AuthenticationService;
    private router: Router;
    public env: any;
    public title: string;

    constructor(
      authenticationService: AuthenticationService,
      router: Router,
      appComponent: AppComponent
      ) {
        this.authenticationService = authenticationService;
        this.router = router;
        this.env = environment;
        this.title = appComponent.getTitle();
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authenticationService.logout();
    }

    navigateToJoinARoom(): void {
        this.router.navigate(['join']).then(r => {});
    }
}
