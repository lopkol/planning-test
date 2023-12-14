import { connect, StringCodec } from "nats";

// to create a connection to a nats-server:
const nc = await connect({ servers: "localhost:4222" });

// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
// const sub = nc.subscribe("hello");
// (async () => {
//     for await (const m of sub) {
//         console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
//     }
//     console.log("subscription closed");
// })();

nc.publish("event.reservation-created", sc.encode(JSON.stringify({
    ownerUrn: 'urn::Tenant:uuid:01d04810-abea-4225-914b-57ca2a02c3c2',
    reservationUrn: 'urn::Reservation:uuid:59fa739b-5450-470b-b7ea-31a29c79b374',
    activity: 'canoe',
    start: '2023-12-01T13:00:00.000Z',
    end: '2023-12-01T14:00:00.000Z',
    note: 'boo',
})));

// we want to ensure that messages that are in flight
// get processed, so we are going to drain the
// connection. Drain is the same as close, but makes
// sure that all messages in flight get seen
// by the iterator. After calling drain,
// the connection closes.
await nc.drain();
