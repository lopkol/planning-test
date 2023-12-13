import { add, Duration, format, parse, startOfDay as dateFnsStartOfDay } from 'date-fns';
import { PeriodUnit } from './period-unit.enum';

/**
 * Returns the list of days in the format YYYY-MM-DD that intersect the given interval
 */
export function getIntersectingDates(start: Date, end: Date): string[] {
  const days = [];
  let current = start;
  while (current <= end) {
    days.push(dateToString(current, 'yyyy-MM-dd'));
    current = addPeriodToDate(current, 1, PeriodUnit.Day);
  }
  const endDay = dateToString(end, 'yyyy-MM-dd');
  if (!days.includes(endDay)) {
    days.push(endDay);
  }

  return days;
}

/**
 * Converts date to string using date-fns format tokens
 * @param {Date} date
 * @param formatStr for options see https://date-fns.org/v2.29.3/docs/format
 * @returns {string}
 */
export function dateToString(date: Date, formatStr = 'yyyy-MM-dd HH:mm:ss'): string {
  return format(date, formatStr);
}

/**
 * Convert a date from string to the Date object.
 * This function uses date-fns/parse under the hood.
 * @param {string} dateString
 * @param {string} format
 * @returns {Date}
 */
export function stringToDate(dateString: string, format: string): Date {
  return parse(dateString, format, new Date());
}

export function addPeriodToDate(date: Date, periodLength: number, periodUnit: PeriodUnit): Date {
  return add(date, convertPeriodLengthAndUnitToDuration(periodLength, periodUnit));
}

function convertPeriodLengthAndUnitToDuration(periodLength: number, periodUnit: PeriodUnit): Duration {
  const duration = {};
  switch (periodUnit) {
    case PeriodUnit.Hour:
      duration['hours'] = periodLength;
      break;
    case PeriodUnit.Day:
      duration['days'] = periodLength;
      break;
    case PeriodUnit.Week:
      duration['weeks'] = periodLength;
      break;
    case PeriodUnit.Month:
      duration['months'] = periodLength;
      break;
    default:
      throw new Error(`Period unit not supported: ${periodUnit}`);
  }

  return duration;
}
