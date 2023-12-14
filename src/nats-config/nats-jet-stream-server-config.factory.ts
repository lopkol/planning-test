import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import {
  NatsJetStreamServer,
  NatsJetStreamServerOptions,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { NatsConnectionConfigFactory } from './nats-connection-config.factory';
import { RetentionPolicy } from 'nats';

const APP_NAME = 'planning-test';

@Injectable()
export class NatsJetStreamServerConfigFactory {
  constructor(
    private readonly connectionFactory: NatsConnectionConfigFactory,
  ) {}

  create(
    options: Partial<NatsJetStreamServerOptions> = {},
  ): NatsJetStreamServer {
    return new NatsJetStreamServer(
      merge<NatsJetStreamServerOptions>(
        {
          connectionOptions: this.connectionFactory.create(
            `${APP_NAME}-listener`,
            false,
          ),
          consumerOptions: {
            deliverGroup: `${APP_NAME}-group`,
            durable: `${APP_NAME}-durable`,
            deliverTo: `${APP_NAME}-messages`,
            ackPolicy: 'Explicit',
            // manualAck: true,
            replayPolicy: 'Original',
            ackWait: 30_000_000_000, // 30 seconds
          },
          streamConfig: {
            name: `${APP_NAME}-stream`,
            subjects: ['event.>', 'event-saved'],
            retention: RetentionPolicy.Workqueue,
          },
        },
        options,
      ),
    );
  }
}
