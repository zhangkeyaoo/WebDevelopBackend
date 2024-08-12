import { Application } from '@midwayjs/koa';
import Router = require('koa-router');
import { IRouterContext } from 'koa-router';
import { LoginController } from './controller/login.controller';

export default (app: Application): void => {
  const router = new Router();
  const loginController = new LoginController();

  // 配置登录路由
  router.post('/api/login', async (ctx: IRouterContext, next: () => Promise<any>) => {
    await loginController.login(ctx);
    await next();
  });

  app.use(router.routes()).use(router.allowedMethods());
}