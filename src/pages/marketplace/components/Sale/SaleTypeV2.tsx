import { useEulerTheme } from '@eulertools/ui';
import React, { FC, useCallback, useContext, useMemo, useState, SyntheticEvent } from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { MarketplaceContext } from 'src/pages/marketplace/components/Context/MarketplaceContext';
import { marketSaleTypeOptions } from 'src/types/marketplace';

interface ITabPanelProps {
  index: number;
  value: number;
}

const TabPanel: FC<ITabPanelProps> = ({ children, index, value }) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
    {value === index && (
      <Box sx={{ paddingY: 1 }}>
        <Typography color="neutral.500" fontSize={13}>
          {children}
        </Typography>
      </Box>
    )}
  </div>
);

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const SaleTypeV2 = () => {
  const theme = useTheme();
  const eulerTheme = useEulerTheme();
  const { sale, updateSale, updateModal } = useContext(MarketplaceContext);

  const currentSale = useMemo(() => marketSaleTypeOptions.find((i) => i.key === sale.kind), [sale?.kind]);
  const [saleCurrentOption, setSaleCurrentOption] = useState(currentSale || marketSaleTypeOptions[0]);
  const [saleType, setSaleType] = useState(saleCurrentOption.key);

  const handleSaleChange = useCallback((event: SyntheticEvent, newSaleType) => {
    setSaleType(newSaleType);
    updateSale((prev) => ({ ...prev, kind: newSaleType }));
    setSaleCurrentOption(marketSaleTypeOptions[newSaleType]);
    updateModal((prev) => ({ ...prev, kind: newSaleType }));
  }, []);

  return (
    <Box>
      <Box
        sx={{
          background: eulerTheme.palette.primary[50],
          borderRadius: theme.spacing(1.5),
          maxHeight: '45px',
          marginBottom: theme.spacing(1),
        }}
      >
        <Tabs
          value={saleType}
          onChange={handleSaleChange}
          centered
          sx={{
            padding: theme.spacing(0.5),
            '& .MuiButtonBase-root': {
              color: 'neutral.500',
              fontSize: '13px',
            },
            '& .MuiTabs-flexContainer': {
              justifyContent: 'space-between',
            },
            '& .MuiButtonBase-root.MuiTab-root': {
              width: '50%',
              borderRadius: theme.spacing(1.25),
              margin: theme.spacing(0),
              minHeight: '37px',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
              backgroundColor: theme.palette.background.paper,
              color: eulerTheme.palette.primary[400],
            },
          }}
        >
          <Tab label="Public" {...a11yProps(0)} sx={{ textTransform: 'capitalize' }} />
          <Tab label="Private" {...a11yProps(1)} sx={{ textTransform: 'capitalize' }} />
        </Tabs>
      </Box>
      <TabPanel value={saleType} index={0}>
        {saleCurrentOption.description}
      </TabPanel>
      <TabPanel value={saleType} index={1}>
        {saleCurrentOption.description}
      </TabPanel>
    </Box>
  );
};
