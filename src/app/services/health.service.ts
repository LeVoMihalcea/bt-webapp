import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../components/domain/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  getHealth(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/health`);
  }
}
