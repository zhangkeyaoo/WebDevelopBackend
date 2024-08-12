import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Circle } from './circle';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.activities)
  user: User;

  @ManyToOne(() => Circle, circle => circle.activities)
  circle: Circle;

  @Column({default: 0})
  postCount: number;

  @Column({default: 0})
  commentCount: number;

}