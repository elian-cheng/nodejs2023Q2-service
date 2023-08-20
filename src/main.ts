import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as yaml from 'js-yaml';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionFilter, createLogsFolder } from './utils/helpers';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(app.get(LoggingService));
  app.useGlobalFilters(new HttpExceptionFilter());

  const document = yaml.load(
    readFileSync(join(__dirname, '..', 'doc', 'api.yaml'), 'utf8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  const logError = (message: string) => {
    const logger = new LoggingService();
    logger.error(message);
    process.exit(1);
  };

  process.on('uncaughtException', (error) => {
    logError(`Uncaught ${error.name}: ${error.message}\n${error.stack}`);
  });

  process.on('unhandledRejection', (reason: Error) => {
    logError(`Unhandled promise rejection: ${reason.message}\n${reason.stack}`);
  });

  await createLogsFolder();

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
