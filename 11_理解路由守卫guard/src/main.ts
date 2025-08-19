import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoginGuard } from './login.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(new LoginGuard()); // 全局Guard

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
