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
      inject: ['test', AppService],
    },

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
