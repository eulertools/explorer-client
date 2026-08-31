import { useEulerTheme } from '@eulertools/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import HashCopyToClipboard from 'src/components/HashCopyToClipboard';
import useSettings from 'src/hooks/useSettings';
import { GlobalModalItem, openModal } from 'src/slices/ui/globalModal';
import { shortAddress } from 'src/utils/stringUtils';
import { EulerLink } from './EulerLink';
import { TruncatedTooltipText } from './TruncatedTooltipText';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: theme.spacing(1),
    },
  }),
);

export enum EulerAddressRenderTypes {
  icons = 'icons',
  truncate_center = 'truncate_center',
  truncate_right = 'truncate_right',
}

export enum EulerAddressTypes {
  token = 'token',
  lptoken = 'lp-token',
  address = 'address',
  txns = 'txns',
  contract = 'contract',
  wallet = 'wallet',
}

interface EulerAddressProps {
  address: string;
  addressRender?: EulerAddressRenderTypes;
  addressType?: EulerAddressTypes;
  /**
   * Tooltip Config
   */
  title?: string;
  /*
   * in some cases you don't need to show  see details
   * because is the current address
   */
  showSeeDetailLink?: boolean;
  /**
   * Modal Config
   */
  showModal?: boolean;
  modal?: Pick<GlobalModalItem, 'config'>;
  hashColor?: string;
  hashIconColor?: string;
  /*
   * Accessibility fix for nested Buttons
   */
  isNestedButton?: boolean;
  removeIcons?: boolean;
}

export const EulerAddress = (props: EulerAddressProps) => {
  const eulerTheme = useEulerTheme();
  const {
    address,
    addressRender = EulerAddressRenderTypes.truncate_center,
    addressType,
    title,
    showSeeDetailLink,
    showModal,
    modal,
    hashColor = eulerTheme.palette.primary[400],
    hashIconColor = eulerTheme.palette.primary[400],
    isNestedButton = false,
    removeIcons = false,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settings } = useSettings();

  const handleModal = useCallback(() => {
    dispatch(
      openModal({
        identifier: address,
        type: addressType,
        config: modal,
      }),
    );
  }, [props.address]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (showModal) {
        handleModal();
        return;
      }
      if (addressType === EulerAddressTypes.token) navigate(`/${settings.network}/token/${address}`);
      else if (addressType === EulerAddressTypes.lptoken) navigate(`/${settings.network}/pair/${address}`);
      else if (addressType === EulerAddressTypes.address) navigate(`/${settings.network}/address/${address}`);
      else if (addressType === EulerAddressTypes.wallet) navigate(`/${settings.network}/wallets/${address}`);
      else navigate(`/${settings.network}/token/${address}`);
    },
    [address],
  );

  const shouldDisplayDetails = typeof showSeeDetailLink === 'boolean' ? showSeeDetailLink : true;
  const content = (
    <>
      {addressRender === EulerAddressRenderTypes.truncate_center ? (
        <Tooltip title={title || address}>
          <span>{shortAddress(address)}</span>
        </Tooltip>
      ) : null}
      {addressRender === EulerAddressRenderTypes.truncate_right ? (
        <TruncatedTooltipText value={address} title={title || address} />
      ) : null}
    </>
  );

  return (
    <Box display="grid" gridTemplateColumns="auto auto" alignItems="center" maxWidth="100%">
      {removeIcons ? (
        content
      ) : (
        <>
          {content}
          <Box display="flex">
            <HashCopyToClipboard
              isNestedButton={isNestedButton}
              color={hashColor}
              iconColor={hashIconColor}
              value={title || address}
            />
            {shouldDisplayDetails ? (
              <Tooltip title={t('See Details')}>
                {/* Fix forwardRef Error & display of Tooltip Title by wrapping in <span></span> */}
                <span>
                  <EulerLink onClickCapture={handleClick} className={classes.link}>
                    {showModal ? (
                      <InfoOutlinedIcon fontSize="small" style={{ color: eulerTheme.palette.primary[400] }} />
                    ) : (
                      <OpenInNewIcon />
                    )}
                  </EulerLink>
                </span>
              </Tooltip>
            ) : null}
          </Box>
        </>
      )}
    </Box>
  );
};
