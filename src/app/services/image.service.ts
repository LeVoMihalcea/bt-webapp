import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import * as SockJS from 'sockjs-client';
import {IFrame, Stomp} from '@stomp/stompjs';
import {Reply} from '@app/components/domain/Reply';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  topic = '/topic/messages';
  stompClient: any;
  public messages: Reply[] = [];

  constructor() {
  }

  connect(): void {
    const ws = new SockJS(environment.socketUrl);
    this.stompClient = Stomp.over(ws);
    const thisSnapshot = this;
    thisSnapshot.stompClient.connect({}, (frame) => {
      thisSnapshot.stompClient.subscribe(thisSnapshot.topic, (sdkEvent) => {
        thisSnapshot.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  send(message: string): void {
    this.stompClient.send('/app/analyse', {}, JSON.stringify(message));
  }

  onMessageReceived(message: IFrame): void {
    console.log('Message Recieved from Server :: ' + message.body);
    console.log(this.messages);
    const parsedMessage = JSON.parse(message.body);
    this.messages.push(parsedMessage);
  }
}
