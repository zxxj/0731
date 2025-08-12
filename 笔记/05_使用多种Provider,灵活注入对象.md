> Nest实现了IOC容器,在项目启动时,会先从入口模块开始扫描,并分析Module之间的引用关系,对象之间的依赖关系,自动把Provider注入到目标对象.

# 什么是Provier?

> 官方定义: Provider是一个可以被注入到其他地方使用的类或值.

# provier的几种写法

```ts
// app.service.ts
import { Injectable } from '@nestjs/common';

// AppService是被@Injectable修饰的class,代表这个类是可注入的也可以被注入
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

## 1. 指定class (useClass)

### provider完整写法

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  // providers: [AppService], // 简写形式

  // 完整写法,通过provide指定token,通过useClass指定对象的类,Nest会自动对它做实例化后用来注入.
  providers: [
    {
      provide: AppService, 
      useClass: AppService, 
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### provider字符串写法

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  // providers: [AppService], // 简写形式

  // 完整写法
  providers: [
    // {
    //   provide: AppService,
    //   useClass: AppService,
    // },
    {
      provide: 'app_service', // token也可以是字符串, token如果是字符串的话,注入的时候就要用@Inject手动指定注入对象的token了,无论是构造器参数注入还是属性注入都要加.
      useClass: AppService,
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(@Inject('app_service') private readonly appService: AppService) {}

  // 如果不想使用构造器注入的方式,也可以使用属性注入的方式, 通过@Inject指定注入的provider的token即可.
  // 属性注入的方式需要token,为什么构造器注入的方式不需要指定token? 因为AppService这个class本身就是token.
  @Inject('app_service')
  private readonly appService2: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

> 相比之下,用 class 做 token 可以省去 @Inject,比较简便.

## 2. 指定值 (useValue)

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],

  providers: [
    // 除了指定class外,还可以直接指定一个值,让IOC容器来注入.
    {
      provide: 'test', // 使用provide指定token
      useValue: { // 使用useValue指定值
        username: 'xin',
        age: 18,
      },
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(
    // 构造器参数注入方式
    @Inject('test') private readonly test1: { username: string; age: number },
  ) {}

  // 属性注入方式
  @Inject('test')
  private readonly test: { username: string; age: number };

  @Get()
  getHello(): string {
    console.log(this.test);

      console.log(this.test1);
    return this.appService.getHello();
  }
}
```

## 3. 支持动态值 (useFactory)

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    // provider的值可能是动态产生的,Nest提供了useFactory用于支持
    {
      provide: 'dynamicValueTest',
      useFactory() {
        return {
          username: 'zxx',
          age: 20,
        };
      },
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(
    // 构造器参数注入方式
   @Inject('dynamicValueTest') private readonly dynamicValueTest1: { username: string; age: number },
  ) {}

  // 属性注入方式
  @Inject('dynamicValueTest')
  private readonly dynamicValueTest2: { username: string; age: number };

  @Get()
  getHello(): string {
    console.log(this.dynamicValueTest1);
    console.log(this.dynamicValueTest2);
    return this.appService.getHello();
  }
  5;
}
```

> useFactory支持通过参数注入别的provider

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  // providers: [AppService], // 简写形式

  // 完整写法
  providers: [
    {
      provide: AppService,
      useClass: AppService,
    },
    {
      provide: 'app_service', // token也可以是字符串, token如果是字符串的话,注入的时候就要用@Inject手动指定注入对象的token了,无论是构造器参数注入还是属性注入都要加.
      useClass: AppService,
    },
    {
      provide: 'test',
      useValue: {
        username: 'xin',
        age: 18,
      },
    },

    // useFactory支持通过参数注入别的provider
    {
      provide: 'dynamicValueAndOtherProviderTest',
      useFactory(
        values: { username: string; age: number },
        appService: AppService,
      ) {
        return {
          obj: values,
          fn: appService.getHello(),
        };
      },
      inject: ['test', AppService], // test代表注入test provider, AppService代表注入AppService provider
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts

import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('dynamicValueAndOtherProviderTest')
    private readonly dynamicValueAndOtherProviderTest: {
      username: string;
      age: number;
      fn: () => void;
    },
  ) {}
  
  // 属性注入方式
  @Inject('dynamicValueAndOtherProviderTest')
  private readonly dynamicValueAndOtherProviderTest2: {
    username: string;
    age: number;
    fn: () => void;
  };

  @Get()
  getHello() {
    console.log(this.dynamicValueAndOtherProviderTest);
    console.log(this.dynamicValueAndOtherProviderTest2);
  }
}
```

> useFactory支持异步,Nest会等拿到异步方法的结果之后再进行注入

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
``
@Module({
  imports: [],
  controllers: [AppController],

  // 完整写法
  providers: [
    // useFactory支持异步,Nest会等拿到异步方法的结果之后再注入
    {
      provide: 'asyncTest',
      useFactory() {
        new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });

        return {
          username: 'x',
          age: 22,
        };
      },
    },
  ],
})
export class AppModule {}
```

```ts
// app.controller.ts

import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(

    // 构造器参数注入方式
    @Inject('dynamicValueTest')
    private readonly asyncTest: { username: string; age: number },
  ) {}

  // 属性注入方式
  @Inject('asyncTest')
  private readonly asyncTest: { username: string; age: number };

  @Get()
  getHello() {
    console.log(this.asyncTest);
  }
}
```

