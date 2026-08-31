/* eslint-disable max-classes-per-file */
export enum ELoginErrors {
  NEEDS_TOTP = 'NEEDS_TOTP',
  GENERIC_ERROR = 'GENERIC_ERROR',
}

export class TotpRequiredError extends Error {
  name = 'Authenticator code required';

  code = ELoginErrors.NEEDS_TOTP;

  message = 'User has MFA and needs to provide software code to authenticate';
}

export class LoginGenericError extends Error {
  name = 'Generic login error.';

  code = ELoginErrors.GENERIC_ERROR;

  message = 'User could not be logged in. Please try again later.';
}
