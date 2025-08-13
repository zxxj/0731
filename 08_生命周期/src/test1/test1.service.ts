import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class Test1Service
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit() {
    console.log('test1 service OnModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test1 service onApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test1 service onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log('test1 service onApplicationShutdown 执行了 signal:' + signal);
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test1 service beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
