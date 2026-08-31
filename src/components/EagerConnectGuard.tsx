import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useEagerConnect, useInactiveListener } from 'src/hooks/useMetamaskAccount';

const EagerConnectGuard: FC = ({ children }) => {
  const { connector } = useWeb3React();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener({
    suppress: !triedEager || !!activatingConnector,
  });

  return <>{children}</>;
};

export default EagerConnectGuard;
