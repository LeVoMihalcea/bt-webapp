import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageRestService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  sendImage(image: string): Observable<any>{
    return this.http.post(`${environment.apiUrl}/image/analyse`, image);
  }
}
