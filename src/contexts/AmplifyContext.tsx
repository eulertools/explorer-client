import { Amplify, Auth } from 'aws-amplify';
import PropTypes from 'prop-types';
import { createContext, FC, ReactNode, useContext, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { clearUserAccount, getUserAccount } from 'src/slices/user/account';
import { getSubscriptionSettings } from 'src/slices/user/subscriptionModal';
import { LoginGenericError, TotpRequiredError } from 'src/utils/login';
import type { CognitoUser, User } from '../types/user';
import ConfigurationContext from './ConfigurationContext';

enum EChallengeNames {
  SMS_MFA = 'SMS_MFA',
  SOFTWARE_TOKEN_MFA = 'SOFTWARE_TOKEN_MFA',
  NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED',
  MFA_SETUP = 'MFA_SETUP',
}

export enum EMFATypes {
  TOTP = 'SOFTWARE_TOKEN_MFA',
  SMS = 'SMS_MFA',
  NOMFA = 'NOMFA',
}

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  cognitoUser: CognitoUser | null;
}

interface AuthContextValue extends State {
  platform: 'Amplify';
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  verifyCode: (username: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  passwordRecovery: (username: string) => Promise<void>;
  passwordReset: (username: string, code: string, newPassword: string) => Promise<void>;
  updateAccount: (attributes: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  requestTotpCode: () => Promise<string>;
  activateTotp: (code: string) => Promise<void>;
  confirmLogin: (challengeAnswer: string, mfaType: EMFATypes) => Promise<User>;
  disableMfa: () => Promise<User>;
  sendVerifyEmailCode: () => Promise<void>;
  verifyEmailWithCode: (code: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type VerifyCodeAction = {
  type: 'VERIFY_CODE';
};

type ResendCodeAction = {
  type: 'RESEND_CODE';
};
type PasswordRecoveryAction = {
  type: 'PASSWORD_RECOVERY';
};

type PasswordResetAction = {
  type: 'PASSWORD_RESET';
};

type UpdateAccountAction = {
  type: 'UPDATE_USER_ACCOUNT';
  payload: {
    attributes: Partial<User>;
  };
};

type ChangePasswordAction = {
  type: 'CHANGE_PASSWORD';
};

type TotpRequiredAction = {
  type: 'TOTP_REQUIRED';
  payload: {
    cognitoUser: CognitoUser;
  };
};

type DisableMfaAction = {
  type: 'DISABLE_MFA';
  payload: {
    user: User;
  };
};

type SendVerifyEmailCodeAction = {
  type: 'SEND_VERIFY_EMAIL_CODE';
};

type VerifyEmailAction = {
  type: 'VERIFY_EMAIL';
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | VerifyCodeAction
  | ResendCodeAction
  | PasswordRecoveryAction
  | PasswordResetAction
  | UpdateAccountAction
  | ChangePasswordAction
  | TotpRequiredAction
  | DisableMfaAction
  | SendVerifyEmailCodeAction
  | VerifyEmailAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  cognitoUser: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: State): State => ({ ...state }),
  VERIFY_CODE: (state: State): State => ({ ...state }),
  RESEND_CODE: (state: State): State => ({ ...state }),
  PASSWORD_RECOVERY: (state: State): State => ({ ...state }),
  PASSWORD_RESET: (state: State): State => ({ ...state }),
  UPDATE_USER_ACCOUNT: (state: State, action: UpdateAccountAction): State => {
    const { attributes } = action.payload;
    const { user } = state;

    return {
      ...state,
      user: {
        ...user,
        ...attributes,
      },
    };
  },
  CHANGE_PASSWORD: (state: State): State => ({ ...state }),
  TOTP_REQUIRED: (state: State, action: TotpRequiredAction): State => {
    const { cognitoUser } = action.payload;

    return {
      ...state,
      cognitoUser,
    };
  },
  DISABLE_MFA: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  SEND_VERIFY_EMAIL_CODE: (state: State): State => ({ ...state }),
  VERIFY_EMAIL: (state: State): State => ({ ...state }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  updateAccount: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  requestTotpCode: () => Promise.resolve(''),
  activateTotp: () => Promise.resolve(),
  confirmLogin: () => Promise.resolve(null),
  disableMfa: () => Promise.resolve(null),
  sendVerifyEmailCode: () => Promise.resolve(),
  verifyEmailWithCode: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const { aws } = useContext(ConfigurationContext);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const amplifyConfiguration = {
          aws_project_region: aws.region,
          aws_cognito_identity_pool_id: '',
          aws_cognito_region: aws.cognito.region,
          aws_user_pools_id: aws.cognito.pool_id,
          aws_user_pools_web_client_id: aws.cognito.client_id,
        };
        Amplify.configure(amplifyConfiguration);
        const user: Partial<User> = await Auth.currentAuthenticatedUser();

        const preferredMfa = await Auth.getPreferredMFA(user, {
          bypassCache: false,
        });

        // Give splash screen some time to show
        setTimeout(() => {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: {
                id: user.attributes.sub,
                email: user.attributes.email,
                given_name: user.attributes.given_name,
                family_name: user.attributes.family_name,
                wallet_hash: user.attributes['custom:wallet_hash'],
                telegram_user_id: user.attributes['custom:telegram_user_id'],
                username: user.username,
                preferred_mfa: preferredMfa as EMFATypes,
              },
            },
          });

          reduxDispatch(getUserAccount());
          reduxDispatch(getSubscriptionSettings());
        }, 1000);
      } catch (error) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const user = await Auth.signIn(username, password);

    // Treat every challenge as an "error"
    if (user.challengeName === EChallengeNames.SOFTWARE_TOKEN_MFA) {
      // Save cognito user returned as we will need to use same data to
      // finish the login process
      dispatch({
        type: 'TOTP_REQUIRED',
        payload: {
          cognitoUser: user,
        },
      });

      throw new TotpRequiredError();
    }

    // Throw generic error for the rest
    if (user.challengeName) {
      throw new LoginGenericError();
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          given_name: user.attributes.given_name,
          family_name: user.attributes.family_name,
          wallet_hash: user.attributes['custom:wallet_hash'],
          telegram_user_id: user.attributes['custom:telegram_user_id'],
          username: user.username,
          preferred_mfa: null,
        },
      },
    });

    reduxDispatch(getUserAccount());
    reduxDispatch(getSubscriptionSettings());
  };

  const logout = async (): Promise<void> => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT',
    });
    reduxDispatch(clearUserAccount());
  };

  const register = async (username: string, password: string, email?: string): Promise<void> => {
    await Auth.signUp({
      username,
      password,
      attributes: { email },
    });

    dispatch({
      type: 'REGISTER',
    });
  };

  const verifyCode = async (username: string, code: string): Promise<void> => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: 'VERIFY_CODE',
    });
  };

  const resendCode = async (username: string): Promise<void> => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE',
    });
  };

  const passwordRecovery = async (username: string): Promise<void> => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY',
    });
  };

  const passwordReset = async (username: string, code: string, newPassword: string): Promise<void> => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: 'PASSWORD_RESET',
    });
  };

  const updateAccount = async (attributes: Partial<User>): Promise<void> => {
    const user = await Auth.currentAuthenticatedUser();

    await Auth.updateUserAttributes(user, attributes);

    const newAttributes = Object.keys(attributes).reduce((acc, key) => {
      const newKey = key.replace('custom:', '');
      acc[newKey] = attributes[key];

      return acc;
    }, {});

    dispatch({
      type: 'UPDATE_USER_ACCOUNT',
      payload: { attributes: newAttributes },
    });
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    const user = await Auth.currentAuthenticatedUser();

    await Auth.changePassword(user, oldPassword, newPassword);

    dispatch({
      type: 'CHANGE_PASSWORD',
    });
  };

  const requestTotpCode = async (): Promise<string> => {
    const user = await Auth.currentAuthenticatedUser();

    return Auth.setupTOTP(user);
  };

  const activateTotp = async (code: string): Promise<void> => {
    const user = await Auth.currentAuthenticatedUser();

    await Auth.verifyTotpToken(user, code);

    await Auth.setPreferredMFA(user, 'TOTP');

    // Logout the user
    logout();
  };

  const confirmLogin = async (challengeAnswer: string, mfaType: EMFATypes): Promise<User> => {
    await Auth.confirmSignIn(state.cognitoUser, challengeAnswer, mfaType as any);

    const authenticatedUser = await Auth.currentAuthenticatedUser();

    const preferredMfa = await Auth.getPreferredMFA(authenticatedUser, {
      bypassCache: false,
    });

    const user = {
      id: authenticatedUser.attributes.sub,
      email: authenticatedUser.attributes.email,
      given_name: authenticatedUser.attributes.given_name,
      family_name: authenticatedUser.attributes.family_name,
      wallet_hash: authenticatedUser.attributes['custom:wallet_hash'],
      telegram_user_id: authenticatedUser.attributes['custom:telegram_user_id'],
      username: authenticatedUser.username,
      preferred_mfa: preferredMfa as EMFATypes,
    };

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });

    return user;
  };

  const disableMfa = async (): Promise<User> => {
    const authenticatedUser = await Auth.currentAuthenticatedUser();

    await Auth.setPreferredMFA(authenticatedUser, EMFATypes.NOMFA);

    // bypassCache to double check we have successfuly removed the MFA method from the user
    const preferredMfa = await Auth.getPreferredMFA(authenticatedUser, {
      bypassCache: false,
    });

    const user = {
      id: authenticatedUser.attributes.sub,
      email: authenticatedUser.attributes.email,
      given_name: authenticatedUser.attributes.given_name,
      family_name: authenticatedUser.attributes.family_name,
      wallet_hash: authenticatedUser.attributes['custom:wallet_hash'],
      telegram_user_id: authenticatedUser.attributes['custom:telegram_user_id'],
      username: authenticatedUser.username,
      preferred_mfa: preferredMfa as EMFATypes,
    };

    dispatch({
      type: 'DISABLE_MFA',
      payload: {
        user,
      },
    });

    return user;
  };

  const sendVerifyEmailCode = async (): Promise<void> => {
    await Auth.verifyCurrentUserAttribute('email');

    dispatch({
      type: 'SEND_VERIFY_EMAIL_CODE',
    });
  };

  const verifyEmailWithCode = async (code: string): Promise<void> => {
    await Auth.verifyCurrentUserAttributeSubmit('email', code);

    dispatch({
      type: 'VERIFY_EMAIL',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Amplify',
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        updateAccount,
        changePassword,
        requestTotpCode,
        activateTotp,
        confirmLogin,
        disableMfa,
        sendVerifyEmailCode,
        verifyEmailWithCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
