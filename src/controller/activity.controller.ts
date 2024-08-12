import { Provide, Controller, Post, Body, Inject, Get, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Repository } from 'typeorm';
import { Activity } from '../entity/activity';
import { User } from '../entity/user';
import { Circle } from '../entity/circle';
import { AppDataSource } from '../db';

@Provide()
@Controller('/api')
export class ActivityController {
  @Inject()
  ctx: Context;

  private activityRepository: Repository<Activity>;
  private userRepository: Repository<User>;
  private circleRepository: Repository<Circle>;

  @Post('/activities')
  async addActivity(@Body() body) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      console.log('Adding activity:', body);
      //获取仓库
      this.activityRepository = AppDataSource.getRepository(Activity);
      this.userRepository = AppDataSource.getRepository(User);
      this.circleRepository = AppDataSource.getRepository(Circle);
      //查找用户和圈子
      const user = await this.userRepository.findOne({ where: { id: body.userId } });
      const circle = await this.circleRepository.findOne({ where: { id: body.circleId }, relations: ['activities' ,'activities.user'] });
      console.log('user', user);
      //检查用户和圈子是否存在
      if (!user || !circle) {
        this.ctx.body = { success: false, message: 'User or Circle not found' };
        return;
      }

    //查找或创建活动
    let activity = await this.activityRepository.findOne({ where: { user: user, circle: circle } });
    if (!activity) {
      activity = new Activity();
      activity.user = user;
      activity.circle = circle;
      activity.postCount = 0;
      activity.commentCount = 0;
    }
    //更新活动
    activity.postCount += body.postCount || 0;
    activity.commentCount += body.commentCount || 0;

    //保存活动
    await this.activityRepository.save(activity);
    //返回成功响应
    this.ctx.body = { success: true, data: activity };
    } catch (error) {
      console.error('Error adding activity:', error);
      this.ctx.body = { success: false, message: 'Internal Server Error' };
      this.ctx.status = 500;
    }
  }

  @Get('/circles/:circleId/activities')
  async getCircleActivities(@Param('circleId') circleId: number) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      console.log('Fetching activities for circleId:', circleId);
      this.activityRepository = AppDataSource.getRepository(Activity);
      this.circleRepository = AppDataSource.getRepository(Circle);

      const circle = await this.circleRepository.findOne({ where: { id: circleId }, relations: ['activities', 'activities.user'] });
      console.log('circle', circle);

      const activities = await this.activityRepository.find({ where: { circle: circle}, relations: ['user','circle'] });

      if (!circle) {
        console.error('Circle not found'); // 添加日志记录
        this.ctx.body = { success: false, message: 'Circle not found' };
        return;
      }

      // if (!circle.activities || circle.activities.length === 0) {
      //   console.log('No activities found for this circle');
      //   this.ctx.body = { success: true, data: [] };
      //   return;
      // }

      const activities_out = activities.map(activity => ({
        username: activity.user.username,
        postCount: activity.postCount,
        commentCount: activity.commentCount,
      }));
      console.log('Mapped activities:', activities_out);

      this.ctx.body = { success: true, data: activities_out };
    } catch (error) {
      console.error('Error fetching circle activities:', error);
      this.ctx.body = { success: false, message: 'Internal Server Error' };
      this.ctx.status = 500;
    }
  }
}