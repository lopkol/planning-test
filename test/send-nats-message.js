// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connect, StringCodec } = require('nats');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateTestReservationEvent } = require('./generate-test-event');

async function createNats() {
  // to create a connection to a nats-server:
  const nc = await connect({ servers: 'localhost:4222' });

  const js = nc.jetstream();

  // create a codec
  const sc = StringCodec();

  return {
    async sendRandomNatsMessage() {
      const payload = generateTestReservationEvent();

      await js.publish(
        'event.reservation-created',
        sc.encode(JSON.stringify(payload)),
      );
    },
    async close() {
      // we want to ensure that messages that are in flight
      // get processed, so we are going to drain the
      // connection. Drain is the same as close, but makes
      // sure that all messages in flight get seen
      // by the iterator. After calling drain on the connection,
      // the connection closes.
      await nc.drain();
    },
  };
}

async function run() {
  // console.log('Sending random message to NATS');
  const conn = await createNats();
  await conn.sendRandomNatsMessage();
  await conn.close();
}

module.exports = {
  run,
};
