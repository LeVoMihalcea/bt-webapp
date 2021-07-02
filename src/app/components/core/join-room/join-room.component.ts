import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '@app/services/room.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {
  error: string;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const code = this.form.controls.code.value;

    this.roomService.joinRoom(code)
      .subscribe(
        data => {
          this.router.navigate(['']);
        },
        error => {
          this.error = error;
        });
  }
}
