import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局中间件
  app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log('全局中间件执行开始', req.url);
    next();
    // console.log('全局中间件执行结束');
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
