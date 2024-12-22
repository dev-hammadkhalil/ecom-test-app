import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Testing db connection
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log(
      '======================================== Database connected successfully! ====================================',
    );
  } else {
    console.log(
      '======================================== Database connection failed! ====================================',
    );
  }

  app.setGlobalPrefix('api');

  // here I am using validation pipe as a global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app
    .listen(configService.get('LOCAL_PORT') || 3006)
    .then(() => {
      console.log(
        `======================================= Server is running on port: ${configService.get(
          'LOCAL_PORT',
        )} =======================================`,
      );
    })
    .catch((error) => {
      console.error('=======  Error starting server: =======', error);
    });
}
bootstrap();
