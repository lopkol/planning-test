import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
