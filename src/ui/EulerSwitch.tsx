import { ExtendedTheme } from '@eulertools/ui';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    switchBase: {
      '&$checked': {
        color: theme.palette.primary.main,
      },
      '&$checked + $track': {
        backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
      },
    },
    checked: {
      color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    },
    track: {
      // Controls default (unchecked) color for the track
      opacity: 0.1,
      // Now set to default Gray color when not checked
      // backgroundColor: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
      '$checked$checked + &': {
        // Controls checked color for the track
        opacity: 0.4,
        backgroundColor: theme.palette.primary.main,
      },
    },
  }),
);

export const EulerSwitch = (props: SwitchProps) => {
  const classes = useStyles();

  return (
    <Switch
      classes={{
        switchBase: classes.switchBase,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
};
