import { loggerInfo } from 'src/utils/logger';

export interface RequestParams {
  [paramName: string]: string | string[] | number;
}

export interface UdfResponse {
  s: string;
}

export interface UdfOkResponse extends UdfResponse {
  s: 'ok';
}

export interface UdfErrorResponse {
  s: 'error';
  errmsg: string;
}

export function logMessage(message: string): void {
  const now = new Date();
  loggerInfo(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`);
}

export function getErrorMessage(error: string | Error | undefined): string {
  if (error === undefined) {
    return '';
  }
  if (typeof error === 'string') {
    return error;
  }

  return error.message;
}
