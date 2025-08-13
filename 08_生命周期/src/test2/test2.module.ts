import {
  BeforeApplicationShutdown,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Test2Service } from './test2.service';
import { Test2Controller } from './test2.controller';

@Module({
  controllers: [Test2Controller],
  providers: [Test2Service],
})
export class Test2Module
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit() {
    console.log('test2 module OnModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test2 module OnApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test2 module onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log('test2 module onApplicationShutdown 执行了 signal:' + signal);
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test2 module beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
