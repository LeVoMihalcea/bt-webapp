import {User} from './User';

export class UserStream {
  user: User;
  stream: any;

  constructor(user: User, stream: any) {
    this.user = user;
    this.stream = stream;
  }
}
