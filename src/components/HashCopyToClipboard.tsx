import { EulerIconDocumentCopy, EulerIconCopySuccess } from '@eulertools/ui';
import clsx from 'clsx';
import { useEffect, useState, FC, MouseEvent } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import gtm from 'src/lib/gtm';

const useStyles = makeStyles(() => ({
  button: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
      opacity: 0.5,
    },
  },
  isNestedButton: {
    display: 'flex',
  },
}));

const SUCCESS_MESSAGE_DELAY = 3000;

interface IHashCopyToClipboardProps {
  color?: string;
  iconColor?: string;
  value: string;
  overflow?: boolean;
  isNestedButton?: boolean;
  customFontSize?: number;
  customFontWeight?: number;
  eventPush?: string;
}

const HashCopyToClipboard: FC<IHashCopyToClipboardProps> = ({
  children,
  value,
  color = 'primary-400',
  iconColor = 'primary-400',
  overflow = true,
  isNestedButton = false,
  customFontSize,
  customFontWeight,
  eventPush,
}) => {
  const classes = useStyles();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (showSuccess) {
      const timeoutId = setTimeout(() => {
        setShowSuccess(false);
      }, SUCCESS_MESSAGE_DELAY);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {};
  }, [showSuccess]);

  const onCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard.writeText(value);
    setShowSuccess(true);
    if (eventPush) {
      gtm.push({ event: eventPush });
    }
  };

  const onNestedCopyToClipboard = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard.writeText(value);
    setShowSuccess(true);
  };

  return (
    <Box display="flex" alignItems="center" maxWidth="100%" overflow="hidden">
      <Typography
        overflow={overflow ? 'hidden' : undefined}
        textOverflow={overflow ? 'ellipsis' : undefined}
        color={color}
        paddingRight={1}
        display="flex"
        alignItems="center"
        fontSize={customFontSize}
        fontWeight={customFontWeight}
      >
        {children}
      </Typography>
      {showSuccess ? (
        <Typography fontSize="small" color="textPrimary" display="flex" alignItems="center">
          <EulerIconCopySuccess size="s" colorLight={iconColor} colorDark="primary-400" />
          &nbsp;Copied!
        </Typography>
      ) : (
        <Tooltip title="Copy">
          {isNestedButton ? (
            <div
              className={clsx(classes.button, classes.isNestedButton)}
              role="button"
              tabIndex={0}
              onKeyDown={null}
              onClick={onNestedCopyToClipboard}
              style={{ color: iconColor }}
            >
              <EulerIconDocumentCopy size="s" colorLight={iconColor} colorDark="primary-400" />
            </div>
          ) : (
            <IconButton className={classes.button} onClickCapture={onCopyToClipboard} style={{ color: iconColor }}>
              <EulerIconDocumentCopy size="s" colorLight={iconColor} colorDark="primary-400" />
            </IconButton>
          )}
        </Tooltip>
      )}
    </Box>
  );
};

export default HashCopyToClipboard;
