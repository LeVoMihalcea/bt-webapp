import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Reply} from '@app/components/domain/Reply';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input()
  public replies: Reply[] = [];

  constructor() { }

  ngOnInit(): void {
    this.replies.length = 0;
  }
}
