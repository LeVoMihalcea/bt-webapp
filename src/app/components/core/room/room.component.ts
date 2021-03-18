import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {TokenService} from '@app/services/token.service';
import {ActivatedRoute} from '@angular/router';
import {AngularAgoraRtcService} from 'angular-agora-rtc';
import {Stream} from 'agora-rtc-sdk';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
  private error = '';
  private token = '';
  private channelKey = '';
  private localStream: Stream;
  remoteCalls: any = [];

  constructor(
    private agoraService: AngularAgoraRtcService,
    public authenticationService: AuthenticationService,
    public tokenService: TokenService,
    private route: ActivatedRoute
  ) {
    this.agoraService.createClient();
  }

  ngOnDestroy(): void {
    this.localStream.stop();
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => this.channelKey = params.id);
    this.tokenService.askForToken(this.channelKey)
      .subscribe(
        data => {
          this.token = data.token;
          this.startCall();
        },
        error => {
          console.log('something went wrong', error);
          this.error = error;
        });
  }

  startCall(): void {
    this.agoraService.client.join(this.token, this.channelKey, this.authenticationService.currentUserValue.id,
      (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
  }

  private subscribeToStreams(): void {
    this.localStream.on('accessAllowed', () => {
      console.log('accessAllowed');
    });
    // The user has denied access to the camera and mic.
    this.localStream.on('accessDenied', () => {
      console.log('accessDenied');
    });

    this.localStream.init(() => {
      console.log('getUserMedia successfully');
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, (err) => {
        console.log('Publish local stream error: ' + err);
      });
      this.agoraService.client.on('stream-published', () => {
        console.log('Publish local stream successfully');
      });
    }, (err) => {
      console.log('getUserMedia failed', err);
    });

    // Add
    this.agoraService.client.on('error', (err) => {
      console.log('Got error msg:', err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey('', () => {
          console.log('Renew channel key successfully');
        }, (error) => {
          console.log('Renew channel key failed: ', error);
        });
      }
    });

    // Add
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    // Add
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) {
        this.remoteCalls.push(`agora_remote${stream.getId()}`);
      }
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    // Add
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

}
