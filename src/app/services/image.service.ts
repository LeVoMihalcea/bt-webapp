import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient
  ) { }

  sendImage(image: string): Observable<any>{
    return this.http.post(`${environment.apiUrl}/image/`, image);
  }
}
