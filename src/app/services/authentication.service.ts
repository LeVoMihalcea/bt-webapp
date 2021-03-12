import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../components/domain/user';
import {environment} from '@environments/environment';
import {Router} from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email, password): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, {email, password})
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(response);
        const user: User = JSON.parse(response.user);
        user.token = response.token;
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return response;
      }));
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }
}
