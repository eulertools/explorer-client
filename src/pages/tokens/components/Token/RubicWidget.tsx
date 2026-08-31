import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useMediaQuery } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useSettings from 'src/hooks/useSettings';
import { ISource } from 'src/types/search';
import { EulerLoading } from 'src/ui/EulerLoading';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'none',
    '&> div': {
      '&:last-child': {
        paddingBottom: 0,
      },
      padding: 0,
    },
  },
  loadingWrapper: {
    '&> div': {
      position: 'absolute',
      width: '100%',
      '& > div': {
        '& > svg#loader': {
          [theme.breakpoints.down(1510)]: {
            height: '500px',
          },
          [theme.breakpoints.up(1510)]: {
            height: '180px',
          },
        },
      },
    },
  },
  iFrameWrapper: {
    visibility: 'hidden',
  },
  iFrameAccordion: {
    padding: 0,
  },
  accordionTitle: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.75,
    textTransform: 'uppercase',
    whiteSpace: 'normal',
    textAlign: 'center',
  },
  accordionDetail: {
    padding: `0 ${theme.spacing(1)} ${theme.spacing(1)}`,
  },
}));

interface IProps {
  token: ISource;
}

const RubicWidget: FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { settings } = useSettings();
  const { network } = useParams();
  const { token } = props;
  const [loaded, setLoaded] = useState(false);
  const [check, setCheck] = useState(true);
  const [open, setOpen] = useState(false);

  const isVertical = useMediaQuery(theme.breakpoints.down(1510));

  if (!token || !token.price_usd) return null;

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    setLoaded(false);
    const rubicNetwork = network.toUpperCase();

    // describe widget configuration and saving to a global variable for future use
    const configuration = {
      from: token.symbol,
      to: network === 'bsc' ? 'BNB' : 'ETH',
      fromChain: rubicNetwork,
      toChain: rubicNetwork,
      amount: 1,
      iframe: 'flex',
      hideSelectionFrom: true,
      hideSelectionTo: false,
      theme: settings.theme === 'DARK' ? 'dark' : 'light',
      background: settings.theme === 'DARK' ? '#000000' : '#ffffff',
      language: settings.language.value === 'es-ES' ? 'es' : 'en',
      injectTokens: {
        [network]: [token.address],
      },
    };

    // create widget
    (window as any).rubicWidget.init(configuration);
  }, [network, open]);

  useEffect(() => {
    const iframe: any = document.getElementById('rubic-widget-iframe');
    const style = 'border: medium none; border-radius: 16px; box-shadow: none; display: block;';
    if (open || !isVertical) {
      if (iframe) {
        iframe.setAttribute('style', style);
        iframe.style.width = '100%';
        // Avoid flashing of IFrame while changing styles
        setTimeout(() => {
          setLoaded(true);
        }, 1000);
      } else {
        setCheck((prev) => !prev);
      }
    }
    return () => {
      setLoaded(false);
    };
  }, [check, open, isVertical]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card className={classes.card}>
          {isVertical ? (
            <Accordion expanded={open} onChange={handleOpen}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={classes.accordionTitle}>Rubic Widget</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetail}>
                {!loaded ? (
                  <Box className={classes.loadingWrapper}>
                    <EulerLoading />
                  </Box>
                ) : null}
                <CardContent className={clsx({ [classes.iFrameWrapper]: !loaded }, classes.iFrameAccordion)}>
                  <div id="rubic-widget-root" />
                </CardContent>
              </AccordionDetails>
            </Accordion>
          ) : (
            <>
              {!loaded ? (
                <Box className={classes.loadingWrapper}>
                  <EulerLoading />
                </Box>
              ) : null}
              <CardContent className={clsx({ [classes.iFrameWrapper]: !loaded })}>
                <div id="rubic-widget-root" />
              </CardContent>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default RubicWidget;
