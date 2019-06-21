import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nickname: string;

  @Column()
  password: string;

  constructor(params: { id?: number; nickname: string; password: string }) {
    this.id = params.id;
    this.nickname = params.nickname;
    this.password = params.password;
  }
}
