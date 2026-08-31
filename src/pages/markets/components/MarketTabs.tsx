import { FC, Dispatch, SetStateAction, ChangeEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useTheme } from '@material-ui/core/styles';
import gtm from 'src/lib/gtm';

interface IMarketTabsProps {
  titles: string[];
  selected: number | string;
  setSelected: Dispatch<SetStateAction<number | string>>;
  customTabs?: string[];
  customOnChange?: (e: any, v: any) => void;
}

export const MarketTabs: FC<IMarketTabsProps> = ({ titles, selected, setSelected, customTabs, customOnChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleTabChange = useCallback((event: ChangeEvent<{}>, newValue: number) => {
    setSelected(newValue);
    gtm.push({ event: `clicked_${titles[newValue]}_tab` });
  }, []);

  function a11yProps(index: number) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  return (
    <Grid item xs={12} sx={{ paddingTop: `${theme.spacing(4)} !important` }}>
      <Tabs
        value={selected}
        onChange={customOnChange || handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        TabIndicatorProps={{ children: <span /> }}
        sx={{
          boxShadow: 'none',
          borderBottom: `1px solid ${(theme as any).palette.neutral[200]}`,
          '& .MuiTabs-flexContainer': {
            marginBottom: theme.spacing(2),
          },
          '& .MuiTab-wrapper': {
            textTransform: 'none',
          },
          '& .MuiTab-root': {
            padding: '0px',
            color: (theme as any).palette.neutral[400],
            minWidth: '80px',
          },
          '& .MuiTab-root.Mui-selected': {
            color: (theme as any).palette.primary[400],
          },
          '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            '& > span': {
              height: '2px',
              width: '100%',
              maxWidth: '20px',
              backgroundColor: (theme as any).palette.primary[400],
              borderRadius: theme.spacing(4),
            },
          },
        }}
      >
        {titles.map((item, index) => {
          if (customTabs)
            return (
              <Tab
                key={item}
                label={t(item)}
                value={customTabs[index]}
                {...a11yProps(index)}
                sx={{ color: theme.palette.text.primary }}
              />
            );
          return <Tab key={item} label={t(item)} {...a11yProps(index)} sx={{ color: theme.palette.text.primary }} />;
        })}
      </Tabs>
    </Grid>
  );
};
