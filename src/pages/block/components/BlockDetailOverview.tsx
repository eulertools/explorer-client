import { ExtendedTheme } from '@eulertools/ui';
import Web3 from 'web3';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import axios from 'src/lib/axios';
import { IBlock } from 'src/types/blockchain';
import { EulerError } from 'src/ui/EulerError';
import { getBigNumberCurrencyLabel } from 'src/utils/bigNumber';
import { loggerError } from 'src/utils/logger';
import { getAge, localeDate } from 'src/utils/moment';

const useStyles = makeStyles((theme) => ({
  arrowIcons: {
    cursor: 'pointer',
    background: ((theme as unknown) as ExtendedTheme).eulerActionSofter,
    color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    margin: theme.spacing(0, 0.5),
    borderRadius: '8px',
    fontSize: '13px',
  },
  label: {
    fontWeight: 'bold',
    color: ((theme as unknown) as ExtendedTheme).palette.terciary[700],
    wordWrap: 'break-word',
  },
}));

interface GridRowProps {
  label: string;
}

const GridRow: FC<GridRowProps> = ({ label, children }) => {
  const classes = useStyles();

  return (
    <>
      <Grid pl={3} pr={2} container marginY={2}>
        <Grid item xs={4} sm={2}>
          <Box className={classes.label}>{label}</Box>
        </Grid>
        <Grid item xs={8} sm={10} paddingTop={0}>
          {children}
        </Grid>
      </Grid>
      <Divider light />
    </>
  );
};
interface IProps {
  blockId: string;
}

const BlockDetailOverview = ({ blockId }: IProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [displayAge, setDisplayAge] = useState(true);

  const [fetchingBlockData, setFetchingBlockData] = useState<boolean>(true);
  const [blockData, setBlockData] = useState<IBlock>(null);

  useEffect(() => {
    async function fetchBlockData() {
      try {
        // For when we navigate blocks from the arrows
        if (!fetchingBlockData) {
          setFetchingBlockData(true);
          setBlockData(null);
        }

        const blockInformationResponse = await axios.publicFetchClient.get<IBlock>(`blocks/${blockId}`);

        setBlockData(blockInformationResponse.data);
      } catch (error) {
        loggerError(error);
      } finally {
        setFetchingBlockData(false);
      }
    }

    fetchBlockData();
  }, [blockId]);

  if (fetchingBlockData) {
    // TODO replace with geras new loading
    return (
      <Grid container alignItems="center" justifyContent="center" display="flex" minHeight="50vh">
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // null at this point implies error
  if (blockData === null) {
    return <EulerError error="There was an error fetching block information. Please try again." />;
  }

  function onViewNextBlockClick() {
    const nextBlock = Number(blockId) + 1;
    navigate(`/${settings.network}/block/${nextBlock}`);
  }

  function onViewPreviousBlockClick() {
    const previousBlock = Number(blockId) - 1;
    navigate(`/${settings.network}/block/${previousBlock}`);
  }

  return (
    <Box fontSize={13} color="terciary.700">
      <Paper
        elevation={0}
        sx={{ marginTop: theme.spacing(3), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(5) }}
      >
        <GridRow label="Block Height">
          <Box display="flex" alignItems="center">
            <Typography fontSize={13} fontWeight={500} color="terciary.700" paddingRight={1}>
              {blockData.number}
            </Typography>
            <Tooltip title="View Previous Block" placement="top">
              <KeyboardArrowLeftIcon className={classes.arrowIcons} onClick={onViewPreviousBlockClick} />
            </Tooltip>
            <Tooltip title="View Next Block" placement="top">
              <KeyboardArrowRightIcon className={classes.arrowIcons} onClick={onViewNextBlockClick} />
            </Tooltip>
          </Box>
        </GridRow>
        <GridRow label="Timestamp">
          <Typography
            onClick={() => setDisplayAge((prev) => !prev)}
            style={{ cursor: 'pointer' }}
            fontSize={13}
            fontWeight={500}
            color="terciary.700"
          >
            {displayAge
              ? getAge(new Date(blockData.timestamp * 1000).toISOString())
              : localeDate(new Date(blockData.timestamp * 1000).toISOString())}
          </Typography>
        </GridRow>
        <GridRow label="Transactions">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {blockData.transactions.length} transactions
          </Typography>
        </GridRow>
        <GridRow label="Validated by">
          <HashCopyToClipboard value={blockData.miner}>
            <Link
              href={`/${settings.network}/address/${blockData.miner}`}
              textOverflow="ellipsis"
              overflow="hidden"
              sx={{
                fontSize: '13px',
                color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                fontWeight: 500,
              }}
            >
              {blockData.miner}
            </Link>
          </HashCopyToClipboard>
        </GridRow>
        <GridRow label="Difficulty">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {blockData.difficulty}
          </Typography>
        </GridRow>
        {/* TBD use decode with correct ABI */}
        <GridRow label="Extra Data">
          <Typography
            fontSize={11}
            fontWeight={500}
            color="terciary.700"
            padding={1}
            sx={{
              wordWrap: 'break-word',
              background: (theme as any).palette.neutral[50],
              borderRadius: theme.spacing(1),
            }}
          >
            {`Hex: 
            {${blockData.extra_data}\n${Web3.utils.hexToAscii(blockData.extra_data)}`}
          </Typography>
        </GridRow>
        <GridRow label="Total Difficulty">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {blockData.total_difficulty}
          </Typography>
        </GridRow>
        <GridRow label="Size">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {blockData.size}&nbsp;bytes
          </Typography>
        </GridRow>
        <GridRow label="Gas Used">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {getBigNumberCurrencyLabel(blockData.gas_used)}
          </Typography>
        </GridRow>
        <GridRow label="Gas Limit">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {getBigNumberCurrencyLabel(blockData.gas_limit)}
          </Typography>
        </GridRow>
        <GridRow label="Hash">
          <HashCopyToClipboard value={blockData.hash} color="terciary.700">
            <Typography fontSize={13} fontWeight={500} textOverflow="ellipsis" overflow="hidden">
              {blockData.hash}
            </Typography>
          </HashCopyToClipboard>
        </GridRow>
        <GridRow label="Parent Hash">
          <HashCopyToClipboard value={blockData.parent_hash}>
            <Link
              href={`/${settings.network}/address/${blockData.parent_hash}`}
              textOverflow="ellipsis"
              overflow="hidden"
              sx={{
                fontSize: '13px',
                color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
                fontWeight: 500,
              }}
            >
              {blockData.parent_hash}
            </Link>
          </HashCopyToClipboard>
        </GridRow>
        <GridRow label="Sha3Uncles">
          <HashCopyToClipboard value={blockData.sha3_uncles} color="terciary.700">
            <Typography fontSize={13} fontWeight={500} textOverflow="ellipsis" overflow="hidden">
              {blockData.sha3_uncles}
            </Typography>
          </HashCopyToClipboard>
        </GridRow>
        <GridRow label="Nonce">
          <Typography fontSize={13} fontWeight={500} color="terciary.700">
            {blockData.nonce}
          </Typography>
        </GridRow>
      </Paper>
    </Box>
  );
};

export default BlockDetailOverview;
