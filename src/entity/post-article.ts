import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,ManyToMany, JoinTable,OneToMany } from 'typeorm';
import { Circle } from './circle';
import { User } from './user';
import { Comment } from './comment';

@Entity()
export class PostArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: 0 }) //likeCount默认值为 0
  likeCount: number;

  @ManyToOne(() => Circle, circle => circle.posts)
  circle: Circle;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @ManyToMany(() => User)
  @JoinTable()
  likedUsers: User[];

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}