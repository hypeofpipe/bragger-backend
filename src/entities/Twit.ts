import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Twit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message: string;

  @ManyToOne(type => User)
  author: User;

  @Column()
  date: string;

  constructor(message: string, author: User, date: string) {
    this.message = message;
    this.author = author;
    this.date = date;
  }
}
