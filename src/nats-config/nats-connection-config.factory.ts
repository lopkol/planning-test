import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsConnectionOptions } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Injectable()
export class NatsConnectionConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  create(
    connectionName: string,
    writeAccess: boolean = false,
    options: Partial<NatsConnectionOptions> = {},
  ): NatsConnectionOptions {
    return merge(
      {
        servers: writeAccess
          ? this.configService.get<string>('WRITE_NATS_URL')
          : this.configService.get<string>('READ_NATS_URL'),
        name: connectionName,
      },
      options,
    );
  }
}
