import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import * as SockJS from 'sockjs-client';
import {IFrame, Stomp} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  topic = '/topic/AI-responses';
  stompClient: any;
  public messages = [];

  constructor() {
  }

  connect(): void {
    console.log('Initialize WebSocket Connection', environment.socketUrl);
    const ws = new SockJS(environment.socketUrl);
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

  onMessageReceived(message: IFrame): void {
    console.log('Message Recieved from Server :: ' + message.body);
    // const parsedMessage = JSON.parse(message.body);
    this.messages.push(message.body);
  }
}
