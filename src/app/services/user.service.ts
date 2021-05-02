import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  getUserDetails(id: number): Observable<any> {
    console.log('GET USER DETAILS!!!: ' + id);
    return this.http.get(`${environment.apiUrl}/users/id/` + id);
  }
}
