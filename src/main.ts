import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http/http-exception.filter';

/**
 * Bootstrap service
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['log'],
  });

  const configService = app.get(ConfigService);
  const APP_VERSION = configService.get('APP_VERSION', '0.0.1');
  const APP_URL = configService.get('APP_URL', '/');
  const SWAGGER_PATH = configService.get('SWAGGER_PATH', '/swagger/docs');
  const LOG_LEVEL = configService.get('LOG_LEVEL') || false;
  if (LOG_LEVEL) {
    const loggerLevel = LOG_LEVEL.split(',');
    Logger.overrideLogger(loggerLevel);
    const logger = new Logger('Gambling');

    app.useLogger(logger);
  }
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const APP_PORT = configService.get('APP_PORT', 3000);
  const APP_HOST = configService.get('APP_HOST', '127.0.0.1');

  const options = new DocumentBuilder()
    .setTitle('Gambling')
    .setDescription('The gambling API description')
    .setVersion(APP_VERSION)
    .setTermsOfService('/docs/additional-documentation/api.html')
    .setContact('I-Link', 'https://i-link.pro', 'vinertsev@gmail.com')
    .addServer(APP_URL, 'main server')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
  await app.listen(APP_PORT, APP_HOST);
}

bootstrap();
