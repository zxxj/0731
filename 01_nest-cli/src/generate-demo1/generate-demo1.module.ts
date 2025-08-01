import { Module } from '@nestjs/common';
import { GenerateDemo1Service } from './generate-demo1.service';
import { GenerateDemo1Controller } from './generate-demo1.controller';

@Module({
  controllers: [GenerateDemo1Controller],
  providers: [GenerateDemo1Service],
})
export class GenerateDemo1Module {}
