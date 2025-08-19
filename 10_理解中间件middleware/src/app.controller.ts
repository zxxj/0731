import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('handler');
    return this.appService.getHello();
  }

  @Get('test1')
  test1() {
    console.log('test1');
  }

  @Get('test2')
  test2() {
    console.log('test2');
  }
}
