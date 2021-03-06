import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {Room} from '../components/domain/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  getRooms(): Observable<Array<Room>> {
    return this.http.get<Array<Room>>(`${environment.apiUrl}/room/active`);
  }

  createRoom(room: Room): Observable<any>{
    return this.http.post(`${environment.apiUrl}/room/create`, room);
  }

  joinRoom(code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/room/join/` + code, null);
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/room/` + roomId);
  }

  leaveRoom(roomId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/room/` + roomId + '/leave');
  }

  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/room/` + roomId);
  }
}
