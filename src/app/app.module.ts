import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/core/home/home.component';
import {RegisterComponent} from './components/core/register/register.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './components/core/login/login.component';
import {JwtInterceptor} from '@app/components/_helpers/interceptors/jwt.interceptor';
import {AuthGuard} from '@app/components/_helpers/guards/auth.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from '@app/components/shared/material/angular-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {CreateRoomComponent} from './components/core/create-room/create-room.component';
import { JoinRoomComponent } from './components/core/join-room/join-room.component';
import { RoomComponent } from './components/core/room/room.component';
import {environment} from '@environments/environment';
import {AngularAgoraRtcModule} from 'angular-agora-rtc';
import {CardModule} from 'primeng/card';
import { ChatComponent } from './components/core/chat/chat.component';
import {WebcamModule} from 'ngx-webcam';
import {NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create', component: CreateRoomComponent, canActivate: [AuthGuard]},
  {path: 'join', component: JoinRoomComponent, canActivate: [AuthGuard]},
  {path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    CreateRoomComponent,
    JoinRoomComponent,
    RoomComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AngularAgoraRtcModule.forRoot({AppID: environment.appId}),
    CardModule,
    WebcamModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
