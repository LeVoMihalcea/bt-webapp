import {Component, Inject, Input, OnInit} from '@angular/core';
import {NgxAgoraService} from 'ngx-agora';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {ClipboardService} from 'ngx-clipboard';
import {ToastService} from '@app/services/toast.service';

@Component({
  selector: 'app-room-information',
  templateUrl: './room-information.component.html',
  styleUrls: ['./room-information.component.css']
})
export class RoomInformationComponent{

  constructor(
    public dialogRef: MatDialogRef<RoomInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room,
    public clipboardService: ClipboardService,
    public toastService: ToastService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  copyIdToClipboard(id: string): void {
    this.clipboardService.copy(id);
    this.toastService.showInfo('Join code copied to clipboard!');
  }
}
