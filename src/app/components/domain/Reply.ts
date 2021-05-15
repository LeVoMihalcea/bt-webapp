export class Reply {
  private _contempt: number;
  private _surprise: number;
  private _happiness: number;
  private _maxValue: number;
  private _neutral: number;
  private _sadness: number;
  private _disgust: number;
  private _anger: number;
  private _fear: number;
  private _message: string;
  private _dominantEmotion: string;

  constructor(contempt: number, surprise: number, happiness: number, maxValue: number, neutral: number,
              sadness: number, disgust: number, anger: number, fear: number, message: string, dominantEmotion: string) {
    this._contempt = contempt;
    this._surprise = surprise;
    this._happiness = happiness;
    this._maxValue = maxValue;
    this._neutral = neutral;
    this._sadness = sadness;
    this._disgust = disgust;
    this._anger = anger;
    this._fear = fear;
    this._message = message;
    this._dominantEmotion = dominantEmotion;
  }


  get contempt(): number {
    return this._contempt;
  }

  set contempt(value: number) {
    this._contempt = value;
  }

  get surprise(): number {
    return this._surprise;
  }

  set surprise(value: number) {
    this._surprise = value;
  }

  get happiness(): number {
    return this._happiness;
  }

  set happiness(value: number) {
    this._happiness = value;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(value: number) {
    this._maxValue = value;
  }

  get neutral(): number {
    return this._neutral;
  }

  set neutral(value: number) {
    this._neutral = value;
  }

  get sadness(): number {
    return this._sadness;
  }

  set sadness(value: number) {
    this._sadness = value;
  }

  get disgust(): number {
    return this._disgust;
  }

  set disgust(value: number) {
    this._disgust = value;
  }

  get anger(): number {
    return this._anger;
  }

  set anger(value: number) {
    this._anger = value;
  }

  get fear(): number {
    return this._fear;
  }

  set fear(value: number) {
    this._fear = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  get dominantEmotion(): string {
    return this._dominantEmotion;
  }

  set dominantEmotion(value: string) {
    this._dominantEmotion = value;
  }
}
