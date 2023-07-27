import { randomUUID } from 'crypto';
interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export default class Album implements IAlbum {
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
