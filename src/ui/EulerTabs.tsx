import { ExtendedTheme } from '@eulertools/ui';
import clsx from 'clsx';
import { FC, Dispatch, SetStateAction, ChangeEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import useSettings from 'src/hooks/useSettings';

const useStyles = makeStyles((theme) => ({
  tabs: {
    background: theme.palette.background.default,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    borderRadius: theme.spacing(2),
    flexContainer: 'flexContainer',
    '& .Mui-selected': {
      color: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    },
  },
  tab: {
    color: (theme as any).palette.neutral[400],
    fontSize: '16px',
  },
  lightTheme: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
  },
  darkTheme: {
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.70),0 3px 4px -2px rgba(0,0,0,0.50)',
  },
  indicator: {
    paddingLeft: theme.spacing(0),
    height: '2px',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: ((theme as unknown) as ExtendedTheme).palette.primary[400],
    },
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface IEulerTabsProps {
  titles: string[];
  selected: number | string;
  setSelected: Dispatch<SetStateAction<number | string>>;
  customTabs?: string[];
  customOnChange?: (e: any, v: any) => void;
  inMarketplace?: boolean;
}

export const EulerTabs: FC<IEulerTabsProps> = ({
  titles,
  selected,
  setSelected,
  customTabs,
  customOnChange,
  inMarketplace,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { settings } = useSettings();
  const lightTheme = settings.theme === 'LIGHT';
  const darkTheme = settings.theme === 'DARK';

  const handleTabChange = useCallback((event: ChangeEvent<{}>, newValue: number) => {
    setSelected(newValue);
  }, []);

  function a11yProps(index: number) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  return (
    <Grid item xs={12}>
      <Tabs
        className={
          !inMarketplace
            ? clsx(classes.tabs, { [classes.lightTheme]: lightTheme }, { [classes.darkTheme]: darkTheme })
            : null
        }
        classes={{ indicator: classes.indicator, flexContainer: classes.flexContainer }}
        value={selected}
        onChange={customOnChange || handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered={!inMarketplace}
        TabIndicatorProps={{ children: <span /> }}
      >
        {titles.map((item, index) => {
          if (customTabs)
            return (
              <Tab key={item} className={classes.tab} label={t(item)} value={customTabs[index]} {...a11yProps(index)} />
            );
          return <Tab key={item} className={classes.tab} label={t(item)} {...a11yProps(index)} />;
        })}
      </Tabs>
    </Grid>
  );
};
