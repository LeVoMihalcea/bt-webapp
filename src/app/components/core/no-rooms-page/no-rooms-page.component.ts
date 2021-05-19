import {Component, OnInit} from '@angular/core';
import {AppComponent} from '@app/app.component';

@Component({
  selector: 'app-no-rooms-page',
  templateUrl: './no-rooms-page.component.html',
  styleUrls: ['./no-rooms-page.component.css']
})
export class NoRoomsPageComponent implements OnInit {

  public title: string;

  constructor(private appComponent: AppComponent) {
    this.title = appComponent.getTitle();
  }

  ngOnInit(): void {
  }

}
