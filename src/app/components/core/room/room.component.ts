import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {TokenService} from '@app/services/token.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomState} from '@app/components/domain/RoomState';
import {ClientConfig, ClientEvent, NgxAgoraService, Stream, StreamEvent, StreamSpec} from 'ngx-agora';
import {ErrorService} from '@app/services/error.service';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {SharedService} from '@app/services/shared.service';
import {Observable, Subject, Subscription, interval} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';
import {ImageService} from '@app/services/image.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  constructor(
    private agoraService: NgxAgoraService,
    public authenticationService: AuthenticationService,
    public tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private errorService: ErrorService,
    private roomService: RoomService,
    private sharedService: SharedService,
    private imageService: ImageService
  ) {
    this.agoraService.createClient(
      RoomComponent.getConfig(),
      true,
      () => {
      },
      () => {
        this.errorService.showError('Something went wrong connecting to Agora');
      }
    );
    this.roomState = new RoomState();
  }

  private error = '';
  private token = '';
  private channelKey = '';
  private localStream: Stream;
  public roomState: RoomState;
  public room: Room;
  public messages: string[];
  private trigger: Subject<void> = new Subject<void>();
  private triggerTimerSubscription: Subscription;
  remoteCalls: any = [];
  breakpoint: any;

  private static getConfig(): ClientConfig {
    return {
      mode: 'live',
      codec: 'vp8'
    };
  }

  static getStreamConfig(uid: number | string): StreamSpec {
    return {
      streamID: uid,
      audio: true,
      video: true,
      screen: false
    };
  }

  ngOnDestroy(): void {
    this.localStream.close();
  }


  ngOnInit(): void {
    this.messages = [];
    this.messages.push('abc');
    this.messages.push('abc');
    this.messages.push('abc');
    this.messages.push('abc');
    this.messages.push('abc');
    this.messages.push('abc');
    this.messages.push('abc');
    console.log('triggered');
    this.triggerTimerSubscription = interval(10000).subscribe(x => {
      console.log('triggered');
      this.trigger.next();
    });
    this.route.params.subscribe(params => {
      this.channelKey = params.id;
      this.sharedService.changeRoomId(this.channelKey);
    });
    this.roomService.getRoomById(this.channelKey)
      .subscribe(
        (data) => {
          this.room = data;
        },
        error => {
          this.errorService.showError(error.message);
        }
      );
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
        this.localStream = this.agoraService.createStream(RoomComponent.getStreamConfig(uid));
        this.localStream.setVideoProfile('720p_3');
        this.initializeTheLocalStream();
        this.setAllTheEventListeners();
      });
  }

  private setAllTheEventListeners(): void {
    this.setEventListenerForCameraAndMicrophoneAccess();
    this.setEventListenerForErrors();
    this.setEventListenerForRemoteStreamsAdded();
    this.setEventListenerForRemoteStreamSubscribed();
    this.setEventListenerForRemoteStreamRemoved();
    this.setEventListenerForPeerLeave();
    // this.setEventListenerForRemoteVideoMuted();
  }

  private setEventListenerForCameraAndMicrophoneAccess(): void {
    // The user has granted access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });
    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      this.errorService.showError('You must provide access to your Microphone and Camera');
    });
  }

  private initializeTheLocalStream(): void {
    this.localStream.init(
      () => {
        console.log('getUserMedia successfully');
        this.localStream.play('agora_local');
        this.agoraService.client.publish(this.localStream, (err) =>
          this.errorService.showError('Publish local stream error: ' + err)
        );
        this.agoraService.client.on(ClientEvent.LocalStreamPublished, (evt) =>
          console.log('Publish local stream successfully')
        );
      },
      (err) => this.errorService.showError('getUserMedia failed' + err)
    );
  }

  private setEventListenerForErrors(): void {
    this.agoraService.client.on(ClientEvent.Error, (err) => {
      console.log('Got error msg:', err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey(
          '',
          () => {
            console.log('Renew channel key successfully');
          },
          (error) => {
            this.errorService.showError('Renew channel key failed: ' + error);
          }
        );
      }
    });
  }

  private setEventListenerForRemoteStreamsAdded(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      this.agoraService.client.subscribe(stream, null, (err) => {
        this.errorService.showError('Subscribe stream failed' + err);
      });
    });
  }

  private setEventListenerForRemoteStreamSubscribed(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) {
        this.remoteCalls.push(`agora_remote${stream.getId()}`);
      }
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 1000);
    });
  }

  private setEventListenerForRemoteStreamRemoved(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(
        (call) => call !== `#agora_remote${stream.getId()}`
      );
      console.log(`Remote stream is removed ${stream.getId()}`);
    });
  }

  private setEventListenerForPeerLeave(): void {
    this.agoraService.client.on(ClientEvent.StreamTypeChanged, (evt) => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', evt);
      const stream = evt.stream as Stream;
      console.log('left' + evt);
      // if (stream) {
      //   stream.stop();
      //   this.remoteCalls = this.remoteCalls.filter(
      //     (call) => call === `#agora_remote${stream.getId()}`
      //   );
      //   console.log(`${evt.uid} left from this channel`);
      // }
    });
  }

  exitCall(): void {
    this.localStream?.close();
    this.router.navigate(['']);
  }

  toggleMute(): void {
    this.roomState.micOff = !this.roomState.micOff;
    if (this.roomState.micOff) {
      this.localStream.muteAudio();
      return;
    }
    this.localStream.unmuteAudio();
  }

  toggleVideo(): void {
    this.roomState.cameraOff = !this.roomState.cameraOff;
    if (this.roomState.cameraOff) {
      this.localStream.muteVideo();
      return;
    }
    this.localStream.unmuteVideo();
  }

  toggleSound(): void {
    this.roomState.soundOff = !this.roomState.soundOff;
    if (this.roomState.soundOff) {
      this.localStream.setAudioVolume(0);
    }
    this.localStream.setAudioVolume(100);
  }

  isCurrentUserHost(): boolean {
    return this.room.host.email === this.authenticationService.currentUserValue.email;
  }

  toggleChat(): void {
    this.roomState.chatOff = !this.roomState.chatOff;
  }

  private setEventListenerForRemoteVideoMuted(): void {
    this.agoraService.client.on(ClientEvent.RemoveVideoMuted, (evt) => {
      console.log((document.getElementById('video' + evt.uid) as HTMLInputElement).replaceWith('<p> Test</p>'));
    });
  }

  public triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage($event: WebcamImage): void {
    console.log($event);
    this.imageService.sendImage($event.imageAsDataUrl)
      .subscribe(data => {
        this.messages.push(data);
      },
      error => {
        this.errorService.showError(error);
      });
  }
}
