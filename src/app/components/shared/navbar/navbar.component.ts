import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    public authenticationService: AuthenticationService;
    private router: Router;

    constructor(authenticationService: AuthenticationService, router: Router) {
        this.authenticationService = authenticationService;
        this.router = router;
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
