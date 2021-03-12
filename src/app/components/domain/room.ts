import {User} from '@app/components/domain/user';

export class Room {
  id: string;
  name: string;
  type: string;
  description: string;
  host: User;


  constructor(name: string, type: string, description: string) {
    this.name = name;
    this.type = type;
    this.description = description;
  }
}
