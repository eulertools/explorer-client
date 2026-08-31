import { EulerIconDocumentCopy, EulerIconCopySuccess } from '@eulertools/ui';
import clsx from 'clsx';
import { useEffect, useState, FC, MouseEvent, ReactNode, forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  iconButton: {
    '&:hover': {
      opacity: 0.5,
    },
  },
  successIcon: {
    cursor: 'auto',
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
  successNestedIcon: {
    display: 'flex',
    padding: 0,
    cursor: 'auto',
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
}));

const SUCCESS_MESSAGE_DELAY = 3000;

interface IIconCopyToClipboardProps {
  text: string;
  copyText?: string;
  icon?: ReactNode;
  iconColor?: string;
  isNestedButton?: boolean;
}

export const IconCopyToClipboard: FC<IIconCopyToClipboardProps> = ({
  text,
  copyText = 'Copy',
  icon,
  iconColor = 'primary-400',
  isNestedButton = false,
}) => {
  const classes = useStyles();
  const [showCopy, setShowCopy] = useState<boolean>(false);

  useEffect(() => {
    if (showCopy) {
      const timeoutId = setTimeout(() => {
        setShowCopy(false);
      }, SUCCESS_MESSAGE_DELAY);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {};
  }, [showCopy]);

  const onCopyToClipboard = (event: MouseEvent<HTMLButtonElement | HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard.writeText(text);
    setShowCopy(true);
  };

  // forwardRef fixes Material UI Error regarding passing Tooltip Text by ref
  const Button = forwardRef<HTMLInputElement>((props, ref) => {
    if (isNestedButton) {
      return (
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          onKeyDown={null}
          onClick={onCopyToClipboard}
          style={{ display: 'flex', cursor: 'pointer' }}
          {...props}
        >
          {icon || <EulerIconDocumentCopy size="s" colorLight={iconColor} colorDark={iconColor} />}
        </div>
      );
    }
    return (
      <IconButton
        {...props}
        className={classes.iconButton}
        ref={ref}
        aria-label="copy"
        size="medium"
        onClickCapture={onCopyToClipboard}
      >
        {icon || <EulerIconDocumentCopy size="s" colorLight={iconColor} colorDark={iconColor} />}
      </IconButton>
    );
  });

  return (
    <Tooltip title={showCopy ? 'Copied!' : copyText}>
      {showCopy ? (
        <IconButton
          className={clsx(classes.successIcon, { [classes.successNestedIcon]: isNestedButton })}
          aria-label="success"
          size="medium"
        >
          <EulerIconCopySuccess size="s" colorLight={iconColor} colorDark={iconColor} />
        </IconButton>
      ) : (
        <Button />
      )}
    </Tooltip>
  );
};
