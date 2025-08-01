import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestGenerateModule } from './test-generate/test-generate.module';
import { GenerateDemo1Module } from './generate-demo1/generate-demo1.module';

@Module({
  imports: [TestGenerateModule, GenerateDemo1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
