import { randomUUID } from 'crypto';

interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export default class Artist implements IArtist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(artistObj) {
    this.id = randomUUID();
    this.name = artistObj.name;
    this.grammy = artistObj.grammy;
  }
}
