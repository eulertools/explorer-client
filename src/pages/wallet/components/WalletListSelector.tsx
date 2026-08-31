import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ChevronDownIcon from 'src/icons/ChevronDown';
import ChevronUpIcon from 'src/icons/ChevronUp';
import { selectMyWallets } from 'src/selectors/wallets';
import { WalletItem } from 'src/slices/user/wallet';
import { EulerAddress, EulerAddressRenderTypes } from 'src/ui/EulerAddress';
import { TruncatedTooltipText } from 'src/ui/TruncatedTooltipText';
import { shortAddress } from 'src/utils/stringUtils';

const useStyles = makeStyles((theme: Theme) => ({
  selectInput: {
    marginTop: 4,
  },
  buttons: {
    width: 'auto',
    borderRadius: theme.spacing(2),
  },
  popper: {
    zIndex: 1,
    width: '100%',
    transform: 'translate(0px, 161px)',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  startIcon: {
    marginRight: '10px',
    marginLeft: '10x',
    '& > svg:nth-of-type(1)': {
      fontSize: '30px',
    },
  },
  listText: {
    color: theme.palette.text.primary,
  },
}));

interface WalletListSelectorProps {
  allowedWallets: WalletItem[];
  value: string;
  onChange: (address: string) => void;
}

export const WalletListSelector = (props: WalletListSelectorProps) => {
  const classes = useStyles();
  const wallets = useSelector(selectMyWallets);
  const { value, onChange, allowedWallets } = props;
  const currentWallet = useMemo(() => wallets.find((i) => i.address === value), [value, wallets]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleChange = useCallback(
    (address: string) => {
      onChange(address);
    },
    [onChange],
  );

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Box display="grid" gridTemplateColumns="auto auto" columnGap={1}>
      <Button
        ref={anchorRef}
        disableRipple
        classes={{ startIcon: classes.startIcon }}
        className={classes.buttons}
        size="large"
        variant="outlined"
        endIcon={
          open ? (
            <ChevronUpIcon className={classes.listText} fontSize="large" />
          ) : (
            <ChevronDownIcon className={classes.listText} fontSize="large" />
          )
        }
        onClick={handleToggle}
      >
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box display="flex" alignItems="center">
            <TruncatedTooltipText className={classes.listText} value={currentWallet.name} />
          </Box>
          <Box display="flex" alignItems="center">
            <Tooltip
              PopperProps={{
                popperOptions: {
                  placement: 'top',
                },
              }}
              title={currentWallet.address}
            >
              <span>{shortAddress(currentWallet.address)}</span>
            </Tooltip>
            <EulerAddress
              isNestedButton
              addressRender={EulerAddressRenderTypes.icons}
              address={value}
              showSeeDetailLink={false}
            />
          </Box>
        </Box>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        className={isMobile ? classes.popper : null}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="network-menu" onKeyDown={handleListKeyDown}>
                  {allowedWallets?.map((w) => (
                    <ListItem key={w.address} button onClick={() => handleChange(w.address)}>
                      <ListItemText
                        className={classes.listText}
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Box>
                              <Typography color="textPrimary">{w.name}</Typography>
                            </Box>
                            <Box ml={3}>
                              <EulerAddress
                                addressRender={EulerAddressRenderTypes.truncate_center}
                                address={w.address}
                                showSeeDetailLink={false}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
