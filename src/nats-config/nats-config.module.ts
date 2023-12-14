import { Module } from '@nestjs/common';
import { NatsConnectionConfigFactory } from './nats-connection-config.factory';
import { NatsJetStreamServerConfigFactory } from './nats-jet-stream-server-config.factory';
import { NatsJetStreamClientConfigFactory } from './nats-jet-stream-client-config.factory';

@Module({
  providers: [
    NatsConnectionConfigFactory,
    NatsJetStreamServerConfigFactory,
    NatsJetStreamClientConfigFactory,
  ],
  exports: [
    NatsConnectionConfigFactory,
    NatsJetStreamServerConfigFactory,
    NatsJetStreamClientConfigFactory,
  ],
})
export class NatsConfigModule {}
