import { Auth } from 'aws-amplify';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSocketIO } from 'react-use-websocket';
import useAuth from 'src/hooks/useAuth';
import { setStatus, updateChannel } from 'src/slices/user/channels';
import { useDispatch } from 'src/store';

export const WebsocketsContext = React.createContext<any>({});

export enum EventType {
  AUTH = 'auth',
}

export interface ChannelMessage {
  channel: string;
  method: string;
  payload: any;
}

interface WebsocketsContextProviderProps {
  uri: string;
  token?: string;
}

const WebsocketsContextProvider: FunctionComponent<WebsocketsContextProviderProps> = ({ children, uri, token }) => {
  const dispatch = useDispatch();
  const { lastMessage = null, readyState } = useSocketIO(`${uri}/ws/`, {
    share: true,
    retryOnError: true,
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    reconnectAttempts: 5,
    queryParams: {
      token,
    },
  });

  useEffect(() => {
    dispatch(setStatus(readyState));
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const { type, payload } = lastMessage;
      const [channel, method] = type.split(' ').filter(Boolean);
      const outputMessage: ChannelMessage = { channel, method, payload };

      if (channel && payload) {
        dispatch(updateChannel(outputMessage));
      }
    }
  }, [lastMessage]);

  return <WebsocketsContext.Provider value={{ uri }}>{children}</WebsocketsContext.Provider>;
};

interface IWebsocketsContextProviderWrapperProps {
  uri: string;
}

const WebsocketsContextProviderWrapper: FunctionComponent<IWebsocketsContextProviderWrapperProps> = ({
  children,
  uri,
}) => {
  const [token, setToken] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const session = await Auth.currentSession();
      const cognitoIdToken = session.getIdToken();

      if (cognitoIdToken) {
        const jwtToken = cognitoIdToken.getJwtToken();

        setToken(jwtToken);
      }
    })();
  }, [user]);

  return token ? (
    <WebsocketsContextProvider uri={uri} token={token}>
      {children}
    </WebsocketsContextProvider>
  ) : (
    <>{children}</>
  );
};

export default WebsocketsContextProviderWrapper;
