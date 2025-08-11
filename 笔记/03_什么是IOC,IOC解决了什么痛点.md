# 后端系统的痛点

> 一个后端系统中,会存在很多的对象:
>
> - Controller对象: 接受HTTP请求,调用Service,返回响应
> - Service对象: 实现业务逻辑
> - Repository对象: 实现对数据库的增删改查
> - DataSource对象: 实现对数据库链接
> - Config对象: 数据库配置对象
>
> 这些对象有着错综复杂的关系:
>
> Controller依赖了Service实现业务逻辑  => Service依赖了Repository来做增删改查  => Repository依赖了DataSource来建立数据库的链接  => DataSource依赖了Config对象拿到用户名密码等信息
>
> 这就导致了创建这些对象是很复杂的,你要理清他们之间的关系,哪个先创建哪个后创建.

```js
// 例如:
const config = new Config({ username: 'zxx', password: '123456' })
const dataSource = new DataSource(config)
const repository = new Repository(dataSource)
const service = new Service(repository)
const controller = new Controller(service)
```

> 要经过一系列的初始化才能使用controller对象.
> 但是像config/dataSource/repository/service/controller等这些对象不需要每次都new一个新的,一直用一个就可以,也就是保持单例.
> 在应用初始化的时候,需要先理清依赖的先后关系,然后创建一大堆对象并组合起来,还要保证不要多次new,是不是很麻烦?
> 没错,这就是后端系统都有的痛点问题,解决这个痛点问题的方式就是IOC.

# 什么是IOC?

> 像之前手动创建一大堆对象不是很麻烦么,那么我能不能在class上声明依赖了什么,然后让工具自己去分析我声明的依赖关系,根据先后顺序自动把对象给我创建好并组装起来呢?

```ts
// 例如AppController中依赖了这个AppService,然后让工具分析依赖自动帮我创建好这两个对象并设置依赖关系.
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) 
}
```

> 这就是IOC的实现思路.
>
> 它有一个存放对象的容器,程序初始化的时候会扫描class上所声明的依赖关系,然后把这些class都new一个实例然后放进容器里.
>
> 创建对象的时候,还会把它们依赖的对象注入进去,这样不就完成了自动的对象创建和组装么?
>
> 这种依赖注入的方式叫做Dependency Injection,简称DI.
>
> 而这种方案为什么叫做DI也容易理解了,本应是手动new依赖对象,然后组装起来,现在是声明依赖了什么,然后等待被注入.
>
> 从主动创建依赖到被动等待依赖注入,这就是Inverse of control, 反转控制.
>
> 在class声明依赖的方式,大家都选择了装饰器的方式(java中叫做注解)

```ts
// Nest启动时会扫描所有带有@Controller/@Injectable等装饰器的类,会把它们注册到IOC容器中.
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // @Controller装饰器,就代表告诉Nest,AppController是一个可被管理的类,就会放入到IOC容器中
export class AppController {
  // Nest看到AppController依赖了AppService,就会去IOC容器里找AppService,如果没有,就会先创建AppService(因为它通常会有@Injectable装饰器),再把它放到IOC容器中
 // 当IOC容器要创建AppController时,会自动把AppService的实例传给构造函数,不需要手动new AppService(),Nest会帮你完成.
  constructor(private readonly appService: AppService)
}
```

- 流程图

```md
      启动阶段（Nest 启动时）
┌───────────────────────────────────────────┐
│ 扫描文件 → 找到带 @Controller / @Injectable 的类 │
└───────────────────────────────────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ IoC 容器（大仓库）        │
   │ 保存“类 → 实例”的映射关系 │
   └──────────────────────────┘
                │
                ▼
  注册阶段：
  ┌─────────────────────────────┐
  │ 发现 AppController 需要 AppService │
  └─────────────────────────────┘
                │
                ▼
     ┌───────────────────────┐
     │ IoC 容器找 AppService   │
     │ 没有 → 创建实例并保存   │
     └───────────────────────┘
                │
                ▼
  创建阶段：
  ┌───────────────────────────────┐
  │ 创建 AppController 实例         │
  │ 构造函数参数 appService  ← 注入 │
  └───────────────────────────────┘
                │
                ▼
   运行阶段：
   AppController 就能直接用
   this.appService 了
```

# Nest中使用IOC

### 通过观察Nest代码来理解它是如何创建对象的

- app.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable() // AppService声明了@Injectable,代表这个class就是可被管理的类,那么Nest就会将它放到IOC容器中.
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

- app.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // AppController声明了@Controller,代表这个class就是可被管理的类,那么Nest也会将它放到IOC容器中.
export class AppController {
  // 会发现构造器中依赖了AppService
    
  // 构造器方式声明依赖
  constructor(private readonly appService: AppService) {}

  // 也可以使用属性方式声明依赖
  @Inject(AppService)
  private readonly appService2: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

- app.module.ts

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 通过@Module声明模块,其中controllers是控制器,只能被注入. providers里可以被注入,也可以注入别的对象,比如这里的AppService
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- main.ts

```ts
// 最后,在入口模块启动项目时,Nest就会从AppModule开始解析class上通过装饰器声明的依赖信息,自动创建和组装对象! 所以AppController只是声明了对AppService的依赖,就可以调用它的方法了! 因为Nest在背后自动做了对象创建和依赖注入的工作!
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

# Nest的模块机制

> Nest的模块机制: 可以将不同业务的controller/service等放到不同的模块里.
>
> nest generate module 模块名

- 创建other模块

```ts
// 1.通过nest cli命令生成模块, 
// 2.执行后会在src目录下创建一个other文件夹
// 3.文件夹中存在一个other.module.ts
// 4.并且OtherModule会自动被imports到AppModule中.
nest generate module other
```

- other.module.ts

```ts
import { Module } from '@nestjs/common';

@Module({})
export class OtherModule {}
```

- app.module.ts

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtherModule } from './other/other.module';

@Module({
  imports: [OtherModule], // 当引入otherModule模块后,如果OtherModule模块exports了provider就可以在这里注入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- 创建service模块

```ts
// 1.生成other.service.ts
// 2.会自动被引入到OtherModule中的providers: [OtherService]
nest generate service other
```

- other.service.ts

```ts
// 加一个方法
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtherService {
  sayHello() {
    return 'hello other service';
  }
}
```

- other.module.ts

```ts
import { Module } from '@nestjs/common';
import { OtherService } from './other.service';

@Module({
  providers: [OtherService],
  exports: [OtherService], // 然后在OtherModule中导出
})
export class OtherModule {}
```

- 其他Service中注入otherService

```ts
// app.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { OtherService } from './other/other.service';

@Injectable()
export class AppService {
  @Inject(OtherService)
  private readonly otherService: OtherService;

  getHello(): string {
    return this.otherService.sayHello();
  }
}

// 浏览器访问下,可以看到AppModule的AppService调用OtherModule的OtherService成功了,这就是Nest的IOC机制.