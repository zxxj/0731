import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeInterceptor } from './time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalInterceptors(new TimeInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
