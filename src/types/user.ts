import { EMFATypes } from 'src/contexts/AmplifyContext';

export interface User {
  id: string;
  email: string;
  username: string;
  family_name: string;
  given_name: string;
  jwt_token?: string;
  preferred_mfa: EMFATypes | null;
  wallet_hash?: string;
  telegram_user_id: string;

  [key: string]: any;
}

// Following 'any' are literally anything and vary according to user
interface ChallengeParam {
  FRIENDLY_DEVICE_NAME: string;
}

interface Client {
  endpoint: string;
  fetchOptions: any;
}

interface Pool {
  userPoolId: string;
  clientId: string;
  client: Client;
  advancedSecurityDataCollectionFlag: boolean;
  storage: any;
}

export interface CognitoUser {
  username: string;
  pool: Pool;
  Session: string;
  client: any;
  signInUserSession?: any;
  authenticationFlowType: string;
  storage: any;
  keyPrefix: string;
  userDataKey: string;
  challengeName?: string;
  challengeParam?: ChallengeParam;
}
