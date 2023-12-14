import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomStrategy } from '@nestjs/microservices';
import { NatsJetStreamServerConfigFactory } from './nats-config/nats-jet-stream-server-config.factory';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const factory = app.get(NatsJetStreamServerConfigFactory);
  const microservice = await NestFactory.createMicroservice<CustomStrategy>(
    AppModule,
    {
      strategy: factory.create(),
    },
  );
  await microservice.listen();
}
bootstrap();
