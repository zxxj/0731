import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class Test2Service
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit() {
    console.log('test2 service OnModuleInit 执行了');
  }

  onApplicationBootstrap() {
    console.log('test2 service OnApplicationBootstrap 执行了');
  }

  onModuleDestroy() {
    console.log('test2 service onModuleDestroy 执行了');
  }

  onApplicationShutdown(signal?: string) {
    console.log('test2 service onApplicationShutdown 执行了 signal:' + signal);
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(
      'test2 service beforeApplicationShutdown 执行了 signal:' + signal,
    );
  }
}
