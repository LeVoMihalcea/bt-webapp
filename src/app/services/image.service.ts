import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import * as SockJS from 'sockjs-client';
import {IFrame, Stomp} from '@stomp/stompjs';
import {Message} from '@app/components/domain/Message';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  topic = '/topic/AI-responses';
  stompClient: any;
  public messages: string[] = [];

  constructor() {
  }

  connect(): void {
    const ws = new SockJS(environment.socketUrl);
    this.stompClient = Stomp.over(ws);
    const thisSnapshot = this;
    console.log('pre-connect');
    thisSnapshot.stompClient.connect({}, (frame) => {
      console.log('in-connect');
      thisSnapshot.stompClient.subscribe(thisSnapshot.topic, (sdkEvent) => {
        console.log('on-message-received');
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
    // const parsedMessage = JSON.parse(message.body);
    this.messages.push(message.body);
  }
}
