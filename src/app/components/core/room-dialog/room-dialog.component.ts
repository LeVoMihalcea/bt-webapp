import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NgxAgoraService} from 'ngx-agora';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent {

  public videoDeviceId: string;
  public audioDeviceId: string;

  constructor(
    public agoraService: NgxAgoraService,
    public dialogRef: MatDialogRef<RoomDialogComponent>) {
  }

  save(): void {
    this.dialogRef.close({videoDeviceId: this.videoDeviceId, audioDeviceId: this.audioDeviceId});
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
