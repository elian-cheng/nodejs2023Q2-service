import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
@Entity()
export default class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Transform((param) => +param.value)
  createdAt: number;

  @UpdateDateColumn({ type: 'timestamp' })
  @Transform((param) => +param.value)
  updatedAt: number;

  @Column()
  @Exclude()
  password: string;
}
