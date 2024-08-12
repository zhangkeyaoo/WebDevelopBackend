import { Controller, Post, Body, Inject , Provide,Put} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AppDataSource } from '../db';
import { User } from '../entity/user';
import { Repository } from 'typeorm';

@Provide()
@Controller('/api')
export class LoginController {
  private userRepository: Repository<User>;
  
  @Inject()
  ctx: Context;

  @Post('/login')
  async login(@Body() body: any) {
    const { userId, password } = body;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  this.userRepository = AppDataSource.getRepository(User);
  // 查找用户
  const user = await this.userRepository.findOneBy({ id: userId });

  if (!user) {
    this.ctx.status = 404;
    this.ctx.body = { success: false, message: 'User not found' };
    return;
  }

    // 验证密码
    if (user.password !== password) {
      this.ctx.status = 401;
      this.ctx.body = { success: false, message: 'Invalid password' };
      return;
    }

    // 登录成功
    this.ctx.body = { success: true, message: 'Login successful', user,userID:user.id,username:user.username };
  }

  @Post('/register')
  async register(@Body() body: any) {
    const { userId, username, password } = body;
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    this.userRepository = AppDataSource.getRepository(User);

    // 检查用户是否已存在
    const existingUser = await this.userRepository.findOneBy({ id: userId });
    if (existingUser) {
      this.ctx.status = 400;
      this.ctx.body = { success: false, message: 'User already exists' };
      return;
    }

    // 创建新用户
    const newUser = new User();
    newUser.id = userId;
    newUser.username = username;
    newUser.password = password;
    await this.userRepository.save(newUser);

    // 注册成功
    this.ctx.body = { success: true, message: 'Registration successful' };
  }

  @Put('/updateUsername')
  async updateUsername(@Body() body: any) {
    const { userId, newUsername } = body;
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    this.userRepository = AppDataSource.getRepository(User);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { success: false, message: 'User not found' };
      return;
    }

    user.username = newUsername;
    await this.userRepository.save(user);

    this.ctx.body = { success: true, message: 'Username updated successfully', username: user.username };
  }

  // @Put('/updateAvatar')
  // async updateAvatar(@Body() body: any) {
  //   const { userId, newAvatarUrl } = body;
  //   if (!AppDataSource.isInitialized) {
  //     await AppDataSource.initialize();
  //   }
  //   this.userRepository = AppDataSource.getRepository(User);
  
  //   const user = await this.userRepository.findOneBy({ id: userId });
  //   if (!user) {
  //     this.ctx.status = 404;
  //     this.ctx.body = { success: false, message: 'User not found' };
  //     return;
  //   }
  
  //   user.avatar = newAvatarUrl;
  //   await this.userRepository.save(user);
  
  //   this.ctx.body = { success: true, message: 'Avatar updated successfully', avatar: user.avatar };
  // }
}