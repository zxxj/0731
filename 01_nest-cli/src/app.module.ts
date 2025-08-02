import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestGenerateModule } from './test-generate/test-generate.module';
import { GenerateDemo1Module } from './generate-demo1/generate-demo1.module';
import { GenerateFileNoFlatController } from './generate-file-no-flat/generate-file-no-flat.controller';
import { GenerateNoSpecController } from './generate-no-spec/generate-no-spec.controller';

@Module({
  imports: [TestGenerateModule, GenerateDemo1Module],
  controllers: [
    AppController,
    GenerateFileNoFlatController,
    GenerateNoSpecController,
  ],
  providers: [AppService],
})
export class AppModule {}
