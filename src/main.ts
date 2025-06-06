import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { WinstonModule } from 'nest-winston';
import { instance } from './services/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule , {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
