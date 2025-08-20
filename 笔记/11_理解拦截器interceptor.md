# 什么是Interceptor?

> Interceptor是拦截器的意思,可以在目标controller方法前后加入一些逻辑.

# 实现Interceptor

```markdown
1.创建项目
> nest new 12_理解拦截器interceptor -s -g -p pnpm

2.通过NestCLI生成一个interceptor
> nest generate interceptor time --no-spec --flat
```

> 生成的interceptor如下:
>
> interceptor要实现NestInterceptor接口, 实现intercept方法, 调用next.handle()就会调用controller,可以在之前和之后加入一些处理逻辑.
>
> controller之前和之后的处理逻辑可能是异步的,Nest里通过rxjs来组织它们,所以可以使用rxjs的各种operator.

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
```

>这里模拟一下接口的耗时时间

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 统计接口耗时的功能

    // 记录开始时间
    const startTime = Date.now();

    // next.handle(): 继续执行后续逻辑(控制器方法)

    // .pipe(
    //   tap(() => {
    //     console.log('time', Date.now() - startTime);
    //   }),
    // ) 在请求执行完成,返回响应时,执行tap内的代码

    return next.handle().pipe(
      tap(() => {
        console.log('time', Date.now() - startTime);
      }),
    );
  }
}
```

> 在controller某个路由中启用interceptor

```ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './time.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TimeInterceptor) // 启用interceptor
  getHello(): string {
    return this.appService.getHello();
  }
}
```

> 运行项目并访问启用interceptor的handle,会发现TimeInterceptor生效了,并打印出了接口耗时

```markdown
[Nest] 16680  - 2025/08/20 14:51:00     LOG [NestApplication] Nest application successfully started +2ms
time 2
```

# Interceptor和middleware的区别

> 主要在与参数不同
>
> interceptor可以拿到调用的controller和handler, 如果在controller和handler上加一些metadata的话,这种就只有interceptor和guard里可以取出来,middleware不行.

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    console.log(context.getHandler(), context.getClass()) // [Function: getHello] [class AppController]

    return next.handle();
  }
}
```

# Interceptor的四种启用方式

> 每个路由单独启用

```ts
  @Get()
  @UseInterceptors(TimeInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }
```

> Controller级别启用: 作用于下面的全部handler

```ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './time.interceptor';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseInterceptors(TimeInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }
}
```

> 全局启用: 作用于全部的Controller

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeInterceptor } from './time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TimeInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

> 全局启用(provider方式): 作用于全部的Controller,并且支持依赖注入

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeInterceptor } from './time.interceptor';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeInterceptor,
    },
  ],
})
export class AppModule {}
```

