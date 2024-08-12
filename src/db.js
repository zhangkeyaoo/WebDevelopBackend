const { DataSource } = require('typeorm');
const { User } = require('./entity/user');
const { Circle } = require('./entity/circle');
const { PostArticle } = require('./entity/post-article');
const { Comment } = require('./entity/comment');
const { Activity } = require('./entity/activity');

// 创建数据源
const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'zky134679852zky',
  database: 'web02',
  synchronize: true,
  logging: false,
  entities: [User, Circle, PostArticle,Comment,Activity],
  migrations: ["src/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.js"],
});


AppDataSource.initialize().then(async () => {
  // 创建新用户实例
  const users = [
    { id: '1', username: 'Yao', password: '123456', avatar: 'default' },//用户1
    { id: '2', username: 'Dong', password: '123456', avatar: 'default' }, // 用户2
    { id: '3', username: 'Chuya', password: '123456', avatar: 'default' }, // 用户3
  ];

  // 保存新用户到数据库
  try {
    for (const userData of users) {
      const user = new User();
      const existingUser = await AppDataSource.manager.findOne(User, { where: { id: userData.id } });
      if (existingUser) {
        console.log(`User with id ${userData.id} already exists, skipping save.`);
        continue;
      }
      user.id = userData.id;
      user.username = userData.username;
      user.password = userData.password;
      user.avatar = userData.avatar;
      await AppDataSource.manager.save(user);
    }
    console.log('New Users have been saved');
  } catch (error) {
    console.error('Error saving new users:', error);
  }

  // 查询并打印所有用户
  try {
    const savedUsers = await AppDataSource.manager.find(User);
    console.log('All users:', savedUsers);
  } catch (error) {
    console.error('Error querying users:', error);
  }

  // 创建初始圈子
  const circles = [
    { name: '运动圈', isDefault: true },
    { name: '萌宠圈', isDefault: true },
    { name: '学习圈', isDefault: true },
    { name: '美食圈', isDefault: true },
    { name: '旅行圈', isDefault: true },
  ];
  // 保存初始圈子到数据库
  try {

    
    for (const circleData of circles) {
      const existingCircle = await AppDataSource.manager.findOne(Circle, { where: { name: circleData.name } });
      if (existingCircle) {
        console.log(`Circle with name ${circleData.name} already exists, skipping save.`);
        continue;
      }

      const circle = new Circle();
      circle.name = circleData.name;
      circle.isDefault = circleData.isDefault;
      console.log('circle:', circle);
      await AppDataSource.manager.save(circle);
    }
    console.log('Initial circles have been saved');
  } catch (error) {
    console.error('Error saving initial circles:', error);
  }  
  
  // 更新用户关注的圈子
  // try {
  //   const user1 = await AppDataSource.manager.findOne(User, { where: { id: '1' }, relations: ['circles'] });
  //   const user2 = await AppDataSource.manager.findOne(User, { where: { id: '2' }, relations: ['circles'] });

  //   const circle1 = await AppDataSource.manager.findOne(Circle, { where: { name: '运动圈' } });
  //   const circle2 = await AppDataSource.manager.findOne(Circle, { where: { name: '萌宠圈' } });

  //   if (user1 && circle1) {
  //     user1.circles = [circle1];
  //     circle1.users = [user1];
  //     await AppDataSource.manager.save(circle1);
  //     await AppDataSource.manager.save(user1);
  //   }

  //   if (user2 && circle2) {
  //     user2.circles = [circle2];
  //     circle2.users = [user2];
  //     await AppDataSource.manager.save(circle2);
  //     await AppDataSource.manager.save(user2);
  //   }

  //   console.log('Users have been updated with their circles');
  // } catch (error) {
  //   console.error('Error updating users with circles:', error);
  // }


}).catch(error => console.error('Error during Data Source initialization:', error));

module.exports = { AppDataSource };
