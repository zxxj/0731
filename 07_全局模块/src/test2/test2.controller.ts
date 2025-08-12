import { Controller, Get } from '@nestjs/common';
import { Test2Service } from './test2.service';
import { Test1Service } from 'src/test1/test1.service';

@Controller('test2')
export class Test2Controller {
  constructor(
    private readonly test2Service: Test2Service,

    private readonly test1Service: Test1Service,
  ) {}

  @Get()
  test() {
    console.log(this.test1Service.findAll());
  }
}
