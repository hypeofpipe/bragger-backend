import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { Like } from '../Like/Like.typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @OneToMany(type => Like, like => like.liked)
  likes: Like[]
}