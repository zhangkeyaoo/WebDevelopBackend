import { Entity, PrimaryGeneratedColumn, Column, ManyToMany,OneToMany } from 'typeorm';
import { User } from './user';
import { PostArticle } from './post-article';
import { Activity } from './activity';

@Entity()
export class Circle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string='';
  
  @Column({ default: false })
  isDefault: boolean = false;

  @Column({ default: 0 })
  userCount: number;

  @ManyToMany(() => User, user => user.circles)
  users: User[];
  
  @OneToMany(() => PostArticle, post => post.circle)
  posts: PostArticle[];

  @OneToMany(() => Activity, activity => activity.user)
  activities: Activity[];
}