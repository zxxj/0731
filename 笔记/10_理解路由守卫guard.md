# 什么是Guard?
> Guard是路由守卫的意思,可以用于在调用某个 controller 之前进行权限判断,返回一个布尔值来决定是否放行.

```markdown
流程如下:

客户端发起请求 => Guard => true => 访问controller
			返回客户端 <= false
```

# 实现Guard

> 通过NestCLI生成一个guard文件.
>
> nest generate guard login --no-spec --flat

```ts
// login.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

> Guard要实现CanActivate接口,实现canActivate方法,可以从context中拿到请求的信息,然后做一些权限验证等处理后,会返回true或false.

```ts
// 加一个打印语句,并且返回false.
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context, 'login guard执行了');
    return false;
  }
}
```

## 单个路由启用Guard

> 在controller中启用guard

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LoginGuard) // 启用guard
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

> 然后访问这个被guard的路由,就会发现,由于guard中返回了false,这里访问就会得到403

```markdown
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

## 全局启用Guard的两种方式

> Guard也支持像Middleware一样,同样支持全局启用

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoginGuard } from './login.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new LoginGuard()); // 全局Guard,这样每个路由都会应用这个Guard

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

> 还有一种全局启用的方式,是在AppModule里这样声明:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}
```

> 为什么会有两种全局启用的方式?
>
> 因为 app.useGlobalGuards(new LoginGuard()) 这个是手动 new 的Guard实例, 它不在IOC容器里.
>
> provide方式声明的Guard是在IOC容器里的,因此它可以注入到别的provider

```ts
// 例如注入appService
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable()
export class LoginGuard implements CanActivate {
   
  @Inject(AppService)
  private readonly appService: AppService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context, 'login guard执行了', this.appService.getHello());
    return false;
  }
}
```

> 所以当需要注入别的provider的时候,就要用第二种全局Guard的声明方式.