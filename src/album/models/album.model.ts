import { randomUUID } from 'crypto';

export default class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(albumObj) {
    this.id = randomUUID();
    this.name = albumObj.name;
    this.year = albumObj.year;
    this.artistId = albumObj.artistId;
  }
}
