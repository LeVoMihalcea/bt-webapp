import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '@app/services/room.service';
import {Room} from '@app/components/domain/Room';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  form: FormGroup;
  error: string;

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
      description: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const room = new Room(
      this.form.controls.name.value,
      this.form.controls.type.value,
      this.form.controls.description.value
    );

    this.roomService.createRoom(room)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['']);
        },
        error => {
          console.log('something went wrong', error);
          this.error = error;
        });
  }
}
