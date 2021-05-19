import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxAgoraService} from 'ngx-agora';
import {Room} from "@app/components/domain/Room";

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

  closeDialog(): void {
    this.dialogRef.close({videoDeviceId: this.videoDeviceId, audioDeviceId: this.audioDeviceId});
  }
}
