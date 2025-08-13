import {
  BeforeApplicationShutdown,
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Test2Service } from './test2.service';

@Controller('test2')
export class Test2Controller
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  constructor(private readonly test2Service: Test2Service) {}

  onModuleInit() {
    console.log('test2 controller OnModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test2 controller OnApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test2 controller onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log(
      'test2 controller onApplicationShutdown 执行了 signal:' + signal,
    );
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test2 controller beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
