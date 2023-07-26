import { randomUUID } from 'crypto';

export default class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(trackObj) {
    this.id = randomUUID();
    this.name = trackObj.name;
    this.artistId = trackObj.artistId;
    this.albumId = trackObj.albumId;
    this.duration = trackObj.duration;
  }
}
