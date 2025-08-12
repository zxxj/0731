import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器参数中声明了AppService的依赖,就会自动注入
  constructor(
    @Inject('app_service') private readonly appService: AppService,

    // 构造器参数注入方式
    @Inject('test') private readonly test1: { username: string; age: number },

    @Inject('dynamicValueTest')
    private readonly dynamicValueTest1: { username: string; age: number },

    @Inject('dynamicValueAndOtherProviderTest')
    private readonly dynamicValueAndOtherProviderTest: {
      username: string;
      age: number;
      fn: () => void;
    },
  ) {}

  // 如果不想使用构造器注入的方式,也可以使用属性注入的方式, 通过@Inject指定注入的provider的token即可.
  // 属性注入的方式需要token,为什么构造器注入的方式不需要指定token? 因为AppService这个class本身就是token.
  @Inject('app_service')
  private readonly appService2: AppService;

  // 属性注入方式
  @Inject('test')
  private readonly test: { username: string; age: number };

  @Inject('dynamicValueTest')
  private readonly dynamicValueTest2: { username: string; age: number };

  @Inject('dynamicValueAndOtherProviderTest')
  private readonly dynamicValueAndOtherProviderTest2: {
    username: string;
    age: number;
    fn: () => void;
  };

  @Inject('asyncTest')
  private readonly asyncTest: { username: string; age: number };

  @Get()
  getHello(): string {
    console.log(this.test);
    console.log(this.test1);

    console.log(this.dynamicValueTest1);
    console.log(this.dynamicValueTest2);

    console.log(this.dynamicValueAndOtherProviderTest);
    console.log(this.dynamicValueAndOtherProviderTest2);

    console.log(this.asyncTest);
    return this.appService.getHello();
  }
}
