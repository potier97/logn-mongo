import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import config from '@configdata/env-config';

async function bootstrap() {
  const appConfig = config().amq;
  const host = appConfig.url;
  const queue = appConfig.queue;
  //CONFIGURACION DE CONEXION A RABBIT
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [host],
      queue: queue,
      queueOptions: {
        durable: false,
      },
    },
  };

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceOptions);

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   microserviceOptions,
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // await app.listen();
  await app.startAllMicroservices();
  await app.listen(AppModule.port || 3000);
}
bootstrap();
