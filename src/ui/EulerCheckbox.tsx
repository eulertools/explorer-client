import { ExtendedTheme } from '@eulertools/ui';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

export const EulerCheckbox = withStyles((theme) => ({
  root: {
    // Now set to default Gray color when not checked
    // color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    '&$checked': {
      color: ((theme as unknown) as ExtendedTheme).eulerActionGreen,
    },
  },
  checked: {},
}))((props: CheckboxProps) => <Checkbox color="default" {...props} />);
