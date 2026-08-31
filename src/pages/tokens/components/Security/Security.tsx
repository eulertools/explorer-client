import { FC, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useSettings from 'src/hooks/useSettings';
import axios from 'src/lib/axios';
import { networkToChainIdMap } from 'src/types/blockchain';
import Item from './Item';
import { IGoPlusSecurityDTO, IGoPlusTokenSecurityDetails } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    baseCard: {
      minHeight: '100%',
    },
    container: {
      paddingTop: theme.spacing(2),
    },
    noPadBottom: {
      paddingBottom: '0px',
    },
    explorer: {
      textTransform: 'capitalize',
    },
  }),
);

interface ISecuritySectionProps {
  tokenAddress: string;
}

const Security: FC<ISecuritySectionProps> = ({ tokenAddress }) => {
  const classes = useStyles();
  const { settings } = useSettings();

  const [securityData, setSecurityData] = useState<IGoPlusTokenSecurityDetails>(null);

  const { network } = settings;

  useEffect(() => {
    async function fetchTokenSecurityDetails() {
      const networkId = networkToChainIdMap[network];
      const response = await axios.baseFetchClient.get<IGoPlusSecurityDTO>(
        `https://api.gopluslabs.io/api/v1/token_security/${networkId}?contract_addresses=${tokenAddress}`,
      );

      setSecurityData(response.data?.result?.[tokenAddress.toLowerCase()]);
    }

    fetchTokenSecurityDetails();
  }, [tokenAddress, network]);

  if (!securityData) {
    return <>No security data for this token.</>;
  }

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <Card className={classes.baseCard}>
            <CardHeader className={classes.noPadBottom} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} textAlign="right">
                  <Link href="https://gopluslabs.io/" rel="noopener">
                    <Typography variant="caption" paddingBottom={2} fontWeight={700} fontSize={14}>
                      Powered by GO+ Security
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" paddingBottom={1}>
                    Token Info
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item attribute="True Token" value={securityData.is_true_token} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item attribute="Airdrop Scam" value={securityData.is_airdrop_scam} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Is In Trust List"
                    value={securityData.trust_list}
                    tooltipTitle="It describes whether the token is a famous and trustworthy one added by Go+."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="Holders" value={securityData.holder_count} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="Total Supply" value={securityData.total_supply} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="Owner Balance" value={securityData.owner_balance} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item attribute="Creator Address" value={securityData.creator_address} isHashValue />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="Creator Balance" value={securityData.creator_balance} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="Markets Holded In LPs" value={securityData.lp_holder_count} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isNumber attribute="LP Token Total Supply" value={securityData.lp_total_supply} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isFreeText attribute="Potential Risks Found" value={securityData.other_potential_risks} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item isFreeText attribute="Notes" value={securityData.note} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" paddingBottom={1}>
                    Contract Security
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Open Source"
                    value={securityData.is_open_source}
                    tooltipTitle="Whether this contract is open source."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Proxy Contract"
                    value={securityData.is_mintable}
                    tooltipTitle="Whether this contract has a proxy contract. Most Proxy contracts are accompanied by modifiable implementation contracts, and implementation contracts may contain significant potential risk. When the contract is not Proxy, we will stop detecting other risk items."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Mintable"
                    value={securityData.is_mintable}
                    tooltipTitle="Whether this contract has the function to mint tokens."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item attribute="Owner Address" value={securityData.owner_address} isHashValue />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Can Take Back Ownership"
                    value={securityData.can_take_back_ownership}
                    tooltipTitle="Whether this contract has the function to take back ownership. Ownership is mostly used to adjust the parameters and status of the contract, such as minting, modification of slippage, suspension of trading, setting blacklsit, etc.
                    When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, these functions will most likely be disabled."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Owner Can Change Balance"
                    value={securityData.owner_change_balance}
                    tooltipTitle="Whether the contract owner has the authority to change the balance of any token holder. Token with this feature means that the owner can modify anyone's balance, resulting in an asset straight to zero or a massive minting and sell-off.
                    This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="With Hidden Owner"
                    value={securityData.hidden_owner}
                    tooltipTitle="Whether the contract has hidden owners. For contract with a hidden owner, developer can still manipulate the contract even if the ownership has been abandoned. Hidden owner is often used by developers to hide ownership and is often accompanied by malicious functionality. When the hidden owner exists, it is assumed that ownership has not been abandoned."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" paddingBottom={1}>
                    Trading Security
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    isPercentage
                    attribute="Buy Tax"
                    value={securityData.buy_tax}
                    tooltipTitle={`Buy tax will cause the actual value received when buying a token to be less than expected, and too much buy tax may lead to heavy losses. Sometimes token's anti-bot mechanism would affect our sandbox system, leading to "Cannot Buy" equal to Yes`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    isPercentage
                    attribute="Sell Tax"
                    value={securityData.sell_tax}
                    tooltipTitle={`Sell tax will cause the actual value received when selling a token to be less than expected, and too much buy tax may lead to large losses. When sell-tax is 100% or this token cannot be sold. Sometimes token's trading-cool-down mechanism would affect our sandbox system, so if Trading Cooldown is 1 this will be set to 100%.`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Cannot Buy"
                    value={securityData.cannot_buy}
                    tooltipTitle={`Generally, "Yes" would be found in Reward Tokens. Such Tokens are issued as rewards for some on-chain applications and cannot be bought directly by users. Sometimes token's anti-bot mechanism would affect our sandbox system, causing the display of "Buy Tax" = "100%". When "Cannot Buy" = "Yes", our sandbox system might be bloked, causing the display of "Buy Tax" = "100%" and "Sell Tax" = "100%"`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Cannot Sell All"
                    value={securityData.cannot_sell_all}
                    tooltipTitle="Whether the contract has the function restricting token holder selling all the token. This feature means that you will not be able to sell all your tokens in a single sale. Sometimes you need to leave a certain percentage of the token, e.g. 10%, sometimes you need to leave a fixed number of token, such as 10 token."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Modifiable Tax"
                    value={securityData.slippage_modifiable}
                    tooltipTitle="Whether the trading tax can be modifiable by token contract. Token with modifiable tax means that the contract owner can modify the buy tax or sell tax of the token. This may cause some losses, especially since some contracts have unlimited modifiable tax rates, which would make the token untradeable. This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Honeypot"
                    value={securityData.is_honeypot}
                    tooltipTitle={`It describes whether the token is a honeypot. "HoneyPot" means that the token maybe cannot be sold because of the token contract's function. Hight risk, definitely scam.`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Pausable Transfers"
                    value={securityData.transfer_pausable}
                    tooltipTitle="It describes whether trading can be pausable by token contract. This feature means that the contract owner will be able to suspend trading at any time, after that anyone will not be able to sell, except those who have special authority. This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Blacklist"
                    value={securityData.is_blacklisted}
                    tooltipTitle="It describes whether the blacklist function is not included in the contract. If there is a blacklist, some addresses may not be able to trade normally."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Whitelist"
                    value={securityData.is_whitelisted}
                    tooltipTitle="It describes whether the whitelist function is not included in the contract. If there is a whitelist, some addresses may not be able to trade normally."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item attribute="In Main DEXs" value={securityData.is_in_dex} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Anti Whale"
                    value={securityData.is_anti_whale}
                    tooltipTitle="It describes whether the contract has the function to limit the maximum amount of transactions or the maximum amount of coins held."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Item
                    attribute="Trading with CooldownTime"
                    value={securityData.trading_cooldown}
                    tooltipTitle="It describes whether the contract has trading-cool-down mechanism which can limits the minimum time between two transactions."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Security;
