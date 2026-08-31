import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import React, { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import QuillAuditedBadge from 'src/assets/quillAuditedBadgeWhite.png';
import { CoinDataProvider } from 'src/contexts/CoinDataContext';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useCoinData from 'src/hooks/useCoinData';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'src/lib/axios';
import { EulerAlert } from 'src/ui/EulerAlert';
import { uint256ToDecimalBn } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import StakingEarned from './Claim';
import StakeForm from './Deposit';
import StakingHeader from './Header';
import UnstakeForm from './Withdraw';
import { DEFAULT_LABEL, IWeb3ContractsGrouped } from './shared';
import { stakingStyles } from './styles';

const DividerGrid = () => (
  <Hidden mdDown>
    <Grid item xs={false} md={1} display="flex" alignItems="center" justifyContent="center">
      <Divider orientation="vertical" style={{ height: '100px' }} />
    </Grid>
  </Hidden>
);

function StakingContent(): JSX.Element {
  const { account, active, library, chainId } = useWeb3React();
  const classes = stakingStyles();
  const isMountedRef = useIsMountedRef();
  const { poolDataBUSD } = useCoinData();
  const { chain } = useContext(ConfigurationContext);

  const [eulerWalletBalance, setEulerWalletBalance] = useState<BigNumber | typeof DEFAULT_LABEL>(DEFAULT_LABEL);
  const [eulerUSDPrice, setEulerUSDPrice] = useState<BigNumber>(null);
  const [contractsInstances, setContractsInstances] = useState<{
    tokenContractInstance: any;
    stakingContractInstance: any;
  }>(null);
  const [contractsInformation, setContractsInformation] = useState<IWeb3ContractsGrouped>(null);
  const web3 = React.useRef(null);

  useEffect(() => {
    if (poolDataBUSD?.eulerBalance && poolDataBUSD?.price) {
      setEulerUSDPrice(new BigNumber(poolDataBUSD.price));
    }
  }, [poolDataBUSD]);

  React.useEffect(() => {
    if (!account) {
      setEulerWalletBalance(DEFAULT_LABEL);
      // If we already have info, reuse
      if (contractsInformation?.allowance) {
        setContractsInformation((cur) => ({ ...(cur || ({} as any)), userInfo: null }));
      } else {
        setContractsInformation(null);
      }

      return () => {};
    }

    if (contractsInstances && chainId === chain.bsc.chain_id) {
      const getStakingInformation = async () => {
        // Check if connected wallet already has approved EULER staking to manage your tokens
        // for this use the allowance method: allowance(owner, spender) and also get the user
        // and pool information
        try {
          const [
            allowanceAmount,
            userEulerBalance,
            poolInfo,
            userInfo,
            minDepositAmount,
            totalUsersStaking,
          ] = await Promise.all([
            contractsInstances.tokenContractInstance.methods
              .allowance(account, chain.bsc.products.staking)
              .call({ from: account }),
            contractsInstances.tokenContractInstance.methods.balanceOf(account).call({ from: account }),
            contractsInstances.stakingContractInstance.methods.poolInfo().call({ from: account }),
            contractsInstances.stakingContractInstance.methods.getUserInfo(account).call({ from: account }),
            contractsInstances.stakingContractInstance.methods.minDepositAmount().call({ from: account }),
            contractsInstances.stakingContractInstance.methods.getTotalUsers().call({ from: account }),
          ]);

          const allowance = uint256ToDecimalBn(allowanceAmount);

          if (isMountedRef) {
            setEulerWalletBalance(uint256ToDecimalBn(userEulerBalance || 0));
            setContractsInformation({
              allowance,
              poolInfo,
              userInfo,
              totalUsersStaking,
              minDepositAmount: uint256ToDecimalBn(minDepositAmount),
              token: contractsInstances.tokenContractInstance,
              staking: contractsInstances.stakingContractInstance,
            });
          }
        } catch (error) {
          loggerError(error);
        }
      };

      getStakingInformation();

      const pollStakingInterval = setInterval(() => {
        getStakingInformation();
      }, 6000);

      return () => clearInterval(pollStakingInterval);
    }

    return () => {};
  }, [contractsInstances, account, chainId]);

  React.useEffect(() => {
    // Only instance and get the ABIs once
    if (!contractsInstances && active) {
      const getContractsInstances = async () => {
        const network = 'mainnet';

        const eulerAddress = Web3.utils.toChecksumAddress(chain.bsc.tokens.euler.address);
        const stakingContractAddress = chain.bsc.products.staking;

        // Get the contracts abi and current user wallet balance
        const [tokenAbi, stakingAbi] = await Promise.all([
          axios.baseFetchClient.get<{ abi: any[] }>(
            `${process.env.REACT_APP_ASSETS_URL}/contracts/bsc/${network}/${eulerAddress}/abi.json`,
          ),
          axios.baseFetchClient.get<{ abi: any[] }>(
            `${process.env.REACT_APP_ASSETS_URL}/contracts/bsc/${network}/${stakingContractAddress}/abi.json`,
          ),
        ]);

        // Create the web3 instance with the initialized provider
        web3.current = new Web3(library.provider);

        // Create the Euler Contract instance that will be used first to approve the address for staking
        const tokenContractInstance = new web3.current.eth.Contract(tokenAbi.data.abi, eulerAddress);
        // Create the Euler Staking Contract instance
        const stakingContractInstance = new web3.current.eth.Contract(stakingAbi.data.abi, stakingContractAddress);

        // Make contracts return the revert reason
        // TODO not working in web3 more info: https://github.com/ChainSafe/web3.js/issues/3742
        // enable when solved
        // contractInstance.handleRevert = true;
        // stakingContractInstance.handleRevert = true;

        if (isMountedRef) {
          setContractsInstances({
            tokenContractInstance,
            stakingContractInstance,
          });
        }
      };

      getContractsInstances();
    }
  }, [active]);

  return (
    <>
      {account && chainId !== chain.bsc.chain_id ? (
        <Box mt={2}>
          <EulerAlert
            type="warning"
            message={
              <Box>
                <Typography>
                  Staking is only possible in the BNB network. Please switch your wallet and/or Euler.tools application
                  network selector to BNB.
                </Typography>
              </Box>
            }
            customIcon
          />
        </Box>
      ) : null}
      <Box>
        <Grid container marginTop={1} spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                className={classes.cardHeader}
                title={<StakingHeader eulerUSDPrice={eulerUSDPrice} contractsInformation={contractsInformation} />}
              />
              <CardContent>
                <Grid container pb={1} rowGap={2}>
                  <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="space-between">
                    <StakeForm
                      eulerUSDPrice={eulerUSDPrice}
                      eulerWalletBalance={eulerWalletBalance}
                      contractsInformation={contractsInformation}
                      web3={web3.current}
                    />
                  </Grid>
                  <DividerGrid />
                  <Grid item xs={12} md={4} display="flex" flexDirection="column" justifyContent="space-between">
                    <UnstakeForm
                      eulerUSDPrice={eulerUSDPrice}
                      contractsInformation={contractsInformation}
                      web3={web3.current}
                    />
                  </Grid>
                  <DividerGrid />
                  <Grid item xs={12} md={2} display="flex" flexDirection="column" justifyContent="space-between">
                    <StakingEarned eulerUSDPrice={eulerUSDPrice} contractsInformation={contractsInformation} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box mt={2}>
          <EulerAlert
            type="info"
            message={
              <Box>
                <Typography>
                  Restaking does not require any minimum amount but it will reset the 30-day timer.
                </Typography>
                {chainId === chain.bsc.chain_id ? null : (
                  <Typography>If you really want to stake, you will need to switch to the correct network.</Typography>
                )}
              </Box>
            }
            customIcon
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Link
            href="https://github.com/Quillhash/Audit_Reports/blob/master/Euler%20Staking%20Smart%20Contract%20Audit%20Report%20-%20QuillAudits.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img width={144} height={60} src={QuillAuditedBadge} alt="quill-badge" />
          </Link>
        </Box>
      </Box>
    </>
  );
}

const StakingContentWrapper = () => (
  <CoinDataProvider>
    <StakingContent />
  </CoinDataProvider>
);

export default StakingContentWrapper;
