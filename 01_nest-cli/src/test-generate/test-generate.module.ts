import { Module } from '@nestjs/common';
import { TestGenerateController } from './test-generate.controller';
import { TestGenerateService } from './test-generate.service';

@Module({
  controllers: [TestGenerateController],
  providers: [TestGenerateService],
})
export class TestGenerateModule {}
