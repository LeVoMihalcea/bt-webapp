import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {EMPTY, Subject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {catchError, switchAll, tap} from 'rxjs/operators';
import {webSocket} from 'rxjs/webSocket';
import * as SockJS from 'sockjs-client';
import {CompatClient, Stomp} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  webSocketEndPoint = 'http://localhost:19580/analyse';
  topic = '/topic/AI-responses';
  stompClient: any;

  constructor() {
  }

  connect(): void {
    console.log('Initialize WebSocket Connection', this.webSocketEndPoint);
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const thisCiudat = this;
    thisCiudat.stompClient.connect({}, (frame) => {
      thisCiudat.stompClient.subscribe(thisCiudat.topic, (sdkEvent) => {
        thisCiudat.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  send(message: string): void {
    console.log('calling logout api via web socket');
    this.stompClient.send('/app/analyse', {}, JSON.stringify(message));
  }

  onMessageReceived(message): void {
    console.log('Message Recieved from Server :: ' + message);
  }
}
