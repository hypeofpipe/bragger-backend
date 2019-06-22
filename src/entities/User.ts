import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nickname: string;

  @Column()
  password: string;

  constructor(nickname: string, password: string) {
    this.nickname = nickname;
    this.password = password;
  }
}
