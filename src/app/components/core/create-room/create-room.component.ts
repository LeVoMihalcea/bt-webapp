import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {Router} from '@angular/router';
import {RoomCalendarEntry} from '@app/components/domain/RoomCalendarEntry';
import {DomainValues} from '@app/components/shared/DomainValues';

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
  roomTypes: string[];

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {
    this.roomTypes = DomainValues.roomTypes;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      predefinedType: ['', [Validators.required]],
      type: ['', []],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      firstDateTime: ['', []],
      hours: ['', []],
      repeatEvery: ['', []],
      timeUnit: ['', []]
    });
    console.log(this.form);
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

    console.log(this.form.controls.predefinedType.value);

    const room = new Room(
      this.form.controls.name.value,
      this.form.controls.predefinedType.value === 'Other' ? this.form.controls.type.value : 'Other',
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
