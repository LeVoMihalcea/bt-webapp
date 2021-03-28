import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {Router} from '@angular/router';
import {environment} from '@environments/environment';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    public authenticationService: AuthenticationService;
    private router: Router;
    public env: any;

    constructor(
      authenticationService: AuthenticationService,
      router: Router,
      ) {
        this.authenticationService = authenticationService;
        this.router = router;
        this.env = environment;
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authenticationService.logout();
    }

    navigateToJoinARoom(): void {
        this.router.navigate(['join']);
    }
}
