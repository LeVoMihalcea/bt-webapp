import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {TokenService} from '@app/services/token.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomState} from '@app/components/domain/RoomState';
import {ClientConfig, ClientEvent, NgxAgoraService, Stream, StreamEvent, StreamSpec} from 'ngx-agora';
import {ToastService} from '@app/services/toast.service';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {SharedService} from '@app/services/shared.service';
import {Observable, Subject, Subscription, interval} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';
import {ImageService} from '@app/services/image.service';
import {ClipboardService} from 'ngx-clipboard';
import {UserService} from '@app/services/user.service';
import {UserStream} from '@app/components/domain/UserStream';
import {MatOptionSelectionChange} from '@angular/material/core';
import {RoomDialogComponent} from '@app/components/core/room-dialog/room-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {RoomInformationComponent} from '@app/components/core/room-information/room-information.component';
import {Message} from '@app/components/domain/Message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  constructor(
    public agoraService: NgxAgoraService,
    public authenticationService: AuthenticationService,
    public tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private roomService: RoomService,
    private sharedService: SharedService,
    public imageService: ImageService,
    public clipboardService: ClipboardService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    this.agoraService.createClient(
      RoomComponent.getConfig(),
      true,
      () => {
      },
      () => {
        this.toastService.showError('Something went wrong connecting to Agora');
      }
    );
    this.roomState = new RoomState();
  }
  private token = '';
  private channelKey = '';
  private localStream: Stream;
  public roomState: RoomState;
  public room: Room;
  public messages: Message[] = [];
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
    this.agoraService.client.leave();
    this.triggerTimerSubscription.unsubscribe();
    this.imageService.disconnect();
  }


  ngOnInit(): void {
    this.messages = [];
    this.imageService.connect();
    this.triggerTimerSubscription = interval(10000).subscribe(x => {
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
          this.toastService.showError(error.message);
        }
      );
    this.tokenService.askForToken(this.channelKey)
      .subscribe(
        data => {
          this.token = data.token;
          this.startCall();
        },
        error => {
          this.toastService.showError(error.message);
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
    // this.setEventListenerForRemoteVideoUnmuted();
  }

  private setEventListenerForCameraAndMicrophoneAccess(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {

    });
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      this.toastService.showError('You must provide access to your Microphone and Camera');
    });
  }

  private initializeTheLocalStream(): void {
    this.localStream.init(
      () => {
        this.localStream.play('agora_local');
        this.agoraService.client.publish(this.localStream, (err) =>
          this.toastService.showError('Publish local stream error: ' + err)
        );
        this.agoraService.client.on(ClientEvent.LocalStreamPublished, (evt) =>
          console.log('Publish local stream successfully')
        );
      },
      (err) => this.toastService.showError('getUserMedia failed' + err)
    );
  }

  private setEventListenerForErrors(): void {
    this.agoraService.client.on(ClientEvent.Error, (err) => {
      this.toastService.showError(err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey(
          '',
          () => {},
          (error) => {
            this.toastService.showError('Renew channel key failed: ' + error);
          }
        );
      }
    });
  }

  private setEventListenerForRemoteStreamsAdded(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      this.agoraService.client.subscribe(stream, null, (err) => {
        this.toastService.showError('Subscribe stream failed' + err);
      });
    });
  }

  private setEventListenerForRemoteStreamSubscribed(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;

      this.userService.getUserDetails(evt.stream.getId()).subscribe((user) => {
        if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) {
          this.remoteCalls.push(new UserStream(user, `agora_remote${stream.getId()}`, stream));
        }
      });

      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 1000);
    });
  }

  private setEventListenerForRemoteStreamRemoved(): void {
    this.agoraService.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      stream.stop();
      console.log(this.remoteCalls);
      this.remoteCalls = this.remoteCalls.filter(
        (call) => call !== `agora_remote${stream.getId()}`
      );
    });
  }

  private setEventListenerForPeerLeave(): void {
    this.agoraService.client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call.streamId !== `agora_remote${stream.getId()}`
        );
      }
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
    console.log(this.remoteCalls);
    if (this.roomState.soundOff) {
      this.muteAllRemoteCalls();
      return;
    }
    this.unmuteAllRemoteCalls();
  }

  private muteAllRemoteCalls(): void {
    this.remoteCalls.forEach((remoteCall) => remoteCall.stream.disableAudio());
  }

  private unmuteAllRemoteCalls(): void {
    this.remoteCalls.forEach((remoteCall) => remoteCall.stream.enableAudio());
  }

  isCurrentUserHost(): boolean {
    return this.room.host.email === this.authenticationService.currentUserValue.email;
  }

  toggleChat(): void {
    this.roomState.chatOff = !this.roomState.chatOff;
  }

  private setEventListenerForRemoteVideoMuted(): void {
    this.agoraService.client.on(ClientEvent.RemoveVideoMuted, (evt) => {
      const stream = evt.stream as Stream;
      this.remoteCalls.filter((userStream) => userStream.user.id !== stream.getId());
      this.remoteCalls.stream.disableVideo();
    });
  }

  private setEventListenerForRemoteVideoUnmuted(): void {
    this.agoraService.client.on(ClientEvent.RemoveVideoMuted, (evt) => {
      const stream = evt.stream as Stream;
      this.remoteCalls.filter((userStream) => userStream.user.id !== stream.getId());
      this.remoteCalls.stream.enableVideo();
    });
  }

  public triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage($event: WebcamImage): void {
    this.imageService.send($event.imageAsDataUrl);
  }

  changeCamera($event: MatOptionSelectionChange): void {
    this.localStream.switchDevice('video', $event.source.value.deviceId,
      () => console.log('SUCCESS'), () => console.log('FAILURE'));
  }

  openSettings(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {width: '20%'});
    dialogRef.afterClosed().subscribe((settings) => {
      console.log(settings);
      if (settings.videoDeviceId !== undefined) {
        this.localStream.switchDevice('video', settings.videoDeviceId);
      }
      if (settings.audioDeviceId !== undefined) {
        this.localStream.switchDevice('audio', settings.audioDeviceId);
      }
    });
  }

  openInformationDialog(): void {
    this.dialog.open(RoomInformationComponent, {
      data: this.room
    });
  }
}

