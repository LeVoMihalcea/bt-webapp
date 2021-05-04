export class Message {
  happiness: number;
  sadness: number;
  confusion: number;
  maxValue: number;
  message: string;

  constructor(happiness: number, sadness: number, confusion: number, maxValue: number, message: string) {
    this.happiness = happiness;
    this.sadness = sadness;
    this.confusion = confusion;
    this.maxValue = maxValue;
    this.message = message;
  }
}
