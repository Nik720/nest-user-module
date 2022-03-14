import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { config } from 'aws-sdk';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ExcludeNullInterceptor } from './shared/interceptors/excludeNull.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const configService = app.get(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector)
  ));
  // app.useGlobalInterceptors(new ExcludeNullInterceptor())
  app.use(cookieParser());
  config.update({
    accessKeyId: configService.get('AWS_S3_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_S3_SECRET_KEY'),
    region: configService.get('AWS_REGION')
  })
  await app.listen(3000);
}
bootstrap();
