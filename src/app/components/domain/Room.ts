import {User} from '@app/components/domain/User';
import {RoomCalendarEntry} from '@app/components/domain/RoomCalendarEntry';

export class Room {
  id: string;
  name: string;
  type: string;
  description: string;
  host: User;
  roomCalendarEntry: RoomCalendarEntry;
  timezone: string;

  constructor(name: string, type: string, description: string, roomCalendarEntry?: RoomCalendarEntry) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.roomCalendarEntry = roomCalendarEntry;
  }
}
