import { Entity, PrimaryGeneratedColumn, Column,ManyToMany, JoinTable,OneToMany } from 'typeorm';
import { Circle } from './circle';
import { PostArticle } from './post-article';
import { Comment } from './comment';
import { Activity } from './activity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string = '';

  @Column()
  username: string='';

  @Column()
  password: string='';

  @Column({ default: 'default' })
  avatar: string='';

  @ManyToMany(() => Circle, circle => circle.users)
  @JoinTable()
  circles: Circle[];
  
  @OneToMany(() => PostArticle, post => post.user)
  posts: PostArticle[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Activity, activity => activity.user) 
  activities: Activity[]; 
}