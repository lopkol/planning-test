import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import { NatsJetStreamClientOptions } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { NatsConnectionConfigFactory } from './nats-connection-config.factory';

const APP_NAME = 'planning-test';

@Injectable()
export class NatsJetStreamClientConfigFactory {
  constructor(
    private readonly connectionFactory: NatsConnectionConfigFactory,
  ) {}

  create(
    options: Partial<NatsJetStreamClientOptions> = {},
  ): NatsJetStreamClientOptions {
    return merge(
      {
        connectionOptions: this.connectionFactory.create(
          `${APP_NAME}-publisher`,
          false,
        ),
      },
      options,
    );
  }
}
