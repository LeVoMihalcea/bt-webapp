import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/services/authentication.service';
import {TokenService} from '@app/services/token.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoState} from '@app/components/domain/VideoState';
import {ClientConfig, ClientEvent, NgxAgoraService, Stream, StreamEvent, StreamSpec} from 'ngx-agora';
import {AgoraClient} from 'ngx-agora/lib/data/models/agora-client.model';
import {ErrorService} from '@app/services/error.service';

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
    private errorService: ErrorService
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
    this.videoState = new VideoState();
  }

  private error = '';
  private token = '';
  private channelKey = '';
  private localStream: Stream;
  public videoState: VideoState;
  private agoraClient: AgoraClient;
  remoteCalls: any = [];

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
    this.agoraService.client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call === `#agora_remote${stream.getId()}`
        );
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  exitCall(): void {
    this.agoraService.client.leave(() => {
      },
      (err) => {
        this.errorService.showError('Leave channel failed');
      });
    this.router.navigate(['']);
  }

  toggleMute(): void {
    this.videoState.micOff = !this.videoState.micOff;
    if (this.videoState.micOff) {
      this.localStream.muteAudio();
      return;
    }
    this.localStream.unmuteAudio();
  }

  toggleVideo(): void {
    this.videoState.cameraOff = !this.videoState.cameraOff;
    if (this.videoState.cameraOff) {
      this.localStream.muteVideo();
      return;
    }
    this.localStream.unmuteVideo();
  }

  toggleSound(): void {
    this.videoState.soundOff = !this.videoState.soundOff;
    if (this.videoState.soundOff){
      this.localStream.setAudioVolume(0);
    }
    this.localStream.setAudioVolume(100);
  }
}
