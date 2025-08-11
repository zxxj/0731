import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 构造器方式声明依赖
  constructor(private readonly appService: AppService) {}

  // 属性方式声明依赖
  @Inject(AppService)
  private readonly appService2: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
