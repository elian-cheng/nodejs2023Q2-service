import Album from 'src/album/models/album.model';
import Track from 'src/track/models/track.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}
@Entity()
export default class Artist implements IArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}
