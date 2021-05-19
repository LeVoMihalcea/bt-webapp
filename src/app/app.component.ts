import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {SharedService} from '@app/services/shared.service';
import {Router} from '@angular/router';
import {environment} from '@environments/environment';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'emoti';
  darkTheme: boolean;
  public env: any;
  public mobileQuery: MediaQueryList;
  public mobileQueryListener: () => void;

  constructor(
    public authenticationService: AuthenticationService,
    public sharedService: SharedService,
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.env = environment;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
  }

  getTitle(): string{
    return this.title;
  }

  logout(): void {
    this.authenticationService.logout();
  }

  navigateToJoinARoom(): void {
    this.router.navigate(['join']).then(r => {});
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  isUserInARoom(): boolean{
    return this.router.url.startsWith('/room');
  }

  shouldHideNavbar(): boolean{
    return !this.mobileQuery.matches && this.authenticationService.currentUserValue != null && !this.isUserInARoom();
  }
}
