import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NatsConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  create(
    writeAccess: boolean = false,
    options: Partial<NatsOptions> = {},
  ): NatsOptions {
    return merge(
      {
        transport: Transport.NATS,
        options: {
          servers: [
            writeAccess
              ? this.configService.get<string>('WRITE_NATS_URL')
              : this.configService.get<string>('READ_NATS_URL'),
          ],
        },
      },
      options,
    );
  }
}
