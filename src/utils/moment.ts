import _isNaN from 'lodash/isNaN';
import _toNumber from 'lodash/toNumber';
import moment from 'moment';

export const hourMs = 3_600_000;
export const dayMs = 86_400_000;
export const weekMs = 604_800_000;
export const monthMs = 2_592_000_000;
export const yearMs = 31_536_000_000;

const currentTime = new Date();
currentTime.setHours(0, 0, 0, 0);
const currentTimePlusDay = new Date(currentTime.getTime() + dayMs);

export const today = currentTime.toISOString();
export const tomorrow = currentTimePlusDay.toISOString();

export const getAge = (date: string) => {
  const now = moment(new Date());
  const age = moment(date);
  let diff: number;
  if (now >= age) {
    diff = now.diff(age);
  } else {
    diff = age.diff(now);
  }
  const diffDuration = moment.duration(diff);
  const months = diffDuration.months();
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const mins = diffDuration.minutes();
  const seconds = diffDuration.seconds();
  const label =
    (months > 0 ? `${months}m ` : '') +
    (days > 0 ? `${days}d ` : '') +
    (hours > 0 ? `${hours}h ` : '') +
    (months === 0 && mins > 0 ? `${mins} mins ` : '') +
    (hours === 0 && mins === 0 && seconds > 0 ? `${seconds} secs` : '');
  if (now >= age) {
    return `${label} ago`;
  }
  return `in ${label}`;
};

export const localeDate = (date: string) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

// API Dates tend to come either in Date strings and Time in seconds or milliseconds
export const parseAPIDate = (date: string | number): Date => {
  if (date) {
    const time = _toNumber(date);
    const milliseconds = time.toString().length === 10 ? time * 1000 : time;
    if (!_isNaN(time)) return new Date(milliseconds);
    return new Date(date);
  }
  return null;
};
