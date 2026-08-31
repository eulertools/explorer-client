import { loggerException } from './logger';

export const filterArrayToQuery = (key: string, value: string[] = []) => {
  if (!Array.isArray(value)) {
    loggerException(`wrong format filter ${value}`);
    return '';
  }
  return value.map((v: string) => ` ${key}:${v}`).join(' AND ');
};
