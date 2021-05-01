import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {Router} from '@angular/router';
import {RoomCalendarEntry} from '@app/components/domain/RoomCalendarEntry';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  form: FormGroup;
  error: string;
  scheduledMeeting: boolean;
  date: any;
  recurrentMeeting: boolean;
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      firstDateTime: ['', []],
      hours: ['', []],
      repeatEvery: ['', []],
      timeUnit: ['', []]
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    const roomCalendarEntry = new RoomCalendarEntry(
      this.form.controls.firstDateTime.value ? this.form.controls.firstDateTime.value : new Date().toISOString().toString(),
      this.form.controls.hours.value ? this.form.controls.hours.value : 2,
      this.form.controls.repeatEvery.value ? this.form.controls.repeatEvery.value : 0,
      this.form.controls.timeUnit.value ? this.form.controls.timeUnit.value : 'WEEKLY',
    );

    const room = new Room(
      this.form.controls.name.value,
      this.form.controls.type.value,
      this.form.controls.description.value,
      roomCalendarEntry
    );

    this.roomService.createRoom(room)
      .subscribe(
        data => {
          console.log(data);
          this.loading = false;
          this.router.navigate(['']);
        },
        error => {
          this.loading = false;
          console.log('something went wrong', error);
          this.error = error;
        });
  }
}
