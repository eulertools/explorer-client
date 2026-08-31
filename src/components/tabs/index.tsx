import React from 'react';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

function TabPanelContent(props) {
  const { children } = props;

  return (
    <Box
      bgcolor="background.paper"
      style={{
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        paddingBottom: '48px',
        paddingTop: '8px',
      }}
    >
      {children}
    </Box>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  currentTab: any;
}

export function TabPanel(props: TabPanelProps) {
  const { children, currentTab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        marginTop: '-2px',
      }}
      {...other}
    >
      {currentTab === index ? <TabPanelContent>{children}</TabPanelContent> : null}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  tab1: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      width: '100%',
    },
  },
  bigIndicator: {
    display: 'none',
  },
  badge: {
    position: 'absolute',
    top: theme.spacing(1),
    right: `-${theme.spacing(2)}`,
  },
}));

interface ICustomTabProps {
  tab: number;
  current: number;
  label: string;
  badge?: number | null;
}

const CustomTab = ({ tab, current, label, badge, ...other }: ICustomTabProps) => {
  const classes = useStyles();
  return (
    <Tab
      sx={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        backgroundColor: current === tab ? 'background.paper' : 'transparent',
      }}
      label={
        badge && current === tab ? (
          <Badge badgeContent={badge} color="primary" classes={{ badge: classes.badge }}>
            <Typography fontWeight="bold" color="textPrimary" fontSize={16} lineHeight="170%">
              {label}
            </Typography>
          </Badge>
        ) : (
          <Typography fontWeight="bold" color="textPrimary" fontSize={16} lineHeight="170%">
            {label}
          </Typography>
        )
      }
      {...a11yProps(tab)}
      {...other}
    />
  );
};

interface IProps {
  tabs: string[];
  currentTab: number;
  setCurrentTab: React.Dispatch<number>;
  badge?: number | null;
}

export default function EulerTabs({ tabs, currentTab, setCurrentTab, badge = null }: IProps) {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Tabs
      value={currentTab}
      onChange={handleChange}
      classes={{ indicator: classes.bigIndicator }}
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
      {tabs.map((t, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <CustomTab label={t} tab={idx} current={currentTab} key={`${t}-${idx}`} badge={badge} />
      ))}
    </Tabs>
  );
}
