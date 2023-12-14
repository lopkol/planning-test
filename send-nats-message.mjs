import { connect, StringCodec } from "nats";
import { generateTestReservationEvent } from "./test/generate-test-event.js";

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

nc.publish("event.reservation-created", sc.encode(JSON.stringify(generateTestReservationEvent())));

// we want to ensure that messages that are in flight
// get processed, so we are going to drain the
// connection. Drain is the same as close, but makes
// sure that all messages in flight get seen
// by the iterator. After calling drain,
// the connection closes.
await nc.drain();
