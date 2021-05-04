import {User} from './User';
import {Stream} from 'ngx-agora';

export class UserStream {
  user: User;
  streamId: string;
  stream: Stream;

  constructor(user: User, streamId: any, stream: Stream) {
    this.user = user;
    this.streamId = streamId;
    this.stream = stream;
  }
}
