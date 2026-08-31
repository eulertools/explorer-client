/* eslint-disable no-console */
import * as Sentry from '@sentry/react';

const isDev = process.env.NODE_ENV === 'development';
export const logger = (...args) => isDev && console.log(...args);
export const loggerWarn = (...args) => isDev && console.warn(...args);
export const loggerError = (message: string, err?: any) =>
  isDev
    ? console.error(message)
    : Sentry.captureMessage(`ERROR:::: ${message}${err ? ` EXCEPTION::::${String(err)}` : ''}`);
export const loggerException = (message: string, err?: any) =>
  isDev ? console.error(message) : Sentry.captureException(err);
export const loggerInfo = (...args) => isDev && console.debug(...args);
