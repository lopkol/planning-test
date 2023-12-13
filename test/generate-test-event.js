const { ACTIVITIES } = require('./test-activities');
const { OWNERS } = require('./test-owners');
const { v4: uuidv4 } = require('uuid');
const { add } = require( 'date-fns');

function generateTestReservationEvent() {
  // random start
  const startDay = randomDate('2019-01-01', '2026-12-31');
  const startMin = 30 * randomNumber(12, 48);
  const start = add(startDay, { minutes: startMin });

  // random duration, days are chosen with geometric distribution (so most often it's 0 or 1)
  const durationDays = randomGeometric(1);
  const durationMinutes = 30 * randomNumber(1, 48);
  const end = add(start, { days: durationDays, minutes: durationMinutes });

  return {
    ownerUrn: getRandomElement(OWNERS),
    reservationUrn: 'urn::Reservation:uuid:' + uuidv4().toString(),
    activity: getRandomElement(ACTIVITIES),
    start,
    end,
  }
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomGeometric(rate) {
  rate = rate || 1;
  return Math.floor(-Math.log(Math.random()) / rate);
}

function randomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())).setHours(0, 0, 0, 0);
}

module.exports = {
  generateTestReservationEvent,
}
