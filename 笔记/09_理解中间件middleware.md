# 什么是中间件?

> 中间件是Express里的概念,Nest的底层就是Express,所以自然也可以使用中间件,但是Nest做了进一步的细分,细分为了全局中间件和路由中间件.

## 全局中间件

>  定义全局中间件

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 定义全局中间件
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('执行开始', req.url);
    next();
    console.log('执行结束');
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

>  controller中测试打印

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // 加一个打印
    console.log('handler');
    return this.appService.getHello();
  }
}
```

> 运行项目,访问路由,会观察到控制台打印的执行顺序如下:

```markdown
执行开始 /
handler
执行结束

可以看到在调用handler的前后,都执行了中间件的逻辑.
```

> 在controller中多创建几个路由进行测试.

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('handler');
    return this.appService.getHello();
  }

  @Get('test1')
  test1() {
    console.log('test1');
  }

  @Get('test2')
  test2() {
    console.log('test2');
  }
}
```

> 运行项目,访问这三个路由,会观察到控制台打印的执行顺序如下, 全局中间件的逻辑可以在多个handler之间复用.

```markdown
执行开始 /
handler
执行结束

执行开始 /test1
test1
执行结束

执行开始 /test2
test2
执行结束
```

## 路由中间件

> 除了全局中间件,Nest也支持路由中间件,使用NestCLI创建一个路由中间件:
>
> nest generate middleware log --no-spec --flat
>
> `--no-spec`是不生成测试文件, `--flat`是平铺,不生成目录.

```ts
// 生成的代码是这样的.
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('路由中间件开始', req.url);
    next();
    console.log('路由中间件结束');
  }
}
```

>在.module文件中实现路由中间件, 用forRoutes指定路由中间件在那些路由中生效, /test:path表示当访问/test1和/test2路由时会生效.

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogMiddleware } from './log.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('/test:path');
  }
}
```

>访问test1和test2,会发下如下打印顺序, 访问/则不会触发路由中间件:

```ts
路由中间件开始 /
test1
路由中间件结束
路由中间件开始 /
test2
路由中间件结束
```

