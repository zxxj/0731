import {
  Controller,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Test1Service } from './test1.service';

@Controller('test1')
export class Test1Controller
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  constructor(private readonly test1Service: Test1Service) {}

  onModuleInit() {
    console.log('test1 controller onModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test1 controller onApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test1 controller onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log(
      'test1 controller onApplicationShutdown 执行了 signal:' + signal,
    );
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test1 controller beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
