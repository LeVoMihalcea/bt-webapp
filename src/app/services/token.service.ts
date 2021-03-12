import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Room} from '../components/domain/room';
import {environment} from '../../environments/environment';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  askForToken(roomName: string): Observable<any> {
    return this.http.post<Observable<any>>(`${environment.agoraTokenApiUrl}/agora/token`, {
      uid: this.authenticationService.currentUserValue.id,
      channel: roomName,
      isPublisher: true
    });
  }
}
