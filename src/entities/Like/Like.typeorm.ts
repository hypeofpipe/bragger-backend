import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, ManyToOne } from 'typeorm'
import { User } from '../User/User.typeorm';
import { Post } from '../Post/Post.typeorm';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User, user => user.likes)
  liker: User

  @ManyToOne(type => Post, post => post.likes)
  liked: Post
}