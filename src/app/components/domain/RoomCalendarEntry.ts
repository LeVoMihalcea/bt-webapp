
export class RoomCalendarEntry {
  firstDateTime: string;
  hours: number;
  repeatEvery: number;
  timeUnit: string;

  constructor(firstDateTime: string, hours: number, repeatEvery: number, timeUnit: string) {
    this.firstDateTime = firstDateTime;
    this.hours = hours;
    this.repeatEvery = repeatEvery;
    this.timeUnit = timeUnit;
  }
}
