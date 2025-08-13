import {
  BeforeApplicationShutdown,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Test1Service } from './test1.service';
import { Test1Controller } from './test1.controller';

@Module({
  controllers: [Test1Controller],
  providers: [Test1Service],
})
export class Test1Module
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit() {
    console.log('test1 module OnModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test1 module onApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test1 module onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log('test1 module onApplicationShutdown 执行了 signal:' + signal);
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test1 module beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
