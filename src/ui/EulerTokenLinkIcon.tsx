import clsx from 'clsx';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useSettings from 'src/hooks/useSettings';

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      transform: 'rotate(180deg)',
    },
    actionLogo: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

interface IProps extends Partial<TooltipProps> {
  tokenAddress: string;
  contrastLogo?: boolean;
}

const EulerTokenLinkIcon = ({ tokenAddress, contrastLogo = false, ...tooltipProps }: IProps) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { settings } = useSettings();
  const { chain } = useContext(ConfigurationContext);

  const onClick = () => {
    if (tokenAddress.toLowerCase() === chain.bsc.tokens.euler.address.toLowerCase()) {
      navigate('/token/euler');
    } else {
      navigate(`/${settings.network}/token/${tokenAddress}`);
    }
  };

  return (
    <Tooltip title="Go to details!" {...tooltipProps}>
      <ErrorOutlineIcon
        onClick={onClick}
        classes={{ root: clsx({ [classes.actionLogo]: contrastLogo }, classes.icon) }}
      />
    </Tooltip>
  );
};

export default EulerTokenLinkIcon;
