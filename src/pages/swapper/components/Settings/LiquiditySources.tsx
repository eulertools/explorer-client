import React, { useContext, useState } from 'react';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'src/lib/axios';
import { EulerCheckbox } from 'src/ui/EulerCheckbox';
import { loggerError } from 'src/utils/logger';
import { SwapperContext } from '../../context';
import { swapperStyles } from '../../styles';
import { ILiquiditySourcesDTO } from './types';

interface IProps {
  onBackClick: () => void;
}

const LiquiditySourcesContainer: React.FC<IProps> = ({ onBackClick }) => {
  const classes = swapperStyles();

  const { settings, updateSettings } = useContext(SwapperContext);

  const isMountedRef = useIsMountedRef();

  const [isLoading, setIsLoading] = useState<boolean>(!settings.liquiditySourcesList.length);

  React.useEffect(() => {
    // Fetch all liquidity sources
    const fetchLiquiditySources = async () => {
      if (settings.liquiditySourcesList.length) {
        return;
      }

      try {
        setIsLoading(true);

        const fetchLiquiditySourcesResponse = await axios.baseFetchClient.get<ILiquiditySourcesDTO>(
          'https://api.1inch.io/v4.0/56/liquidity-sources',
        );

        updateSettings({ liquiditySourcesList: fetchLiquiditySourcesResponse.data?.protocols });
      } catch (error) {
        loggerError(error);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchLiquiditySources();
  }, []);

  function onToggleLiquiditySource(id: string) {
    const { excludedLiquiditySources } = settings;
    const index = excludedLiquiditySources.indexOf(id);

    if (index > -1) {
      excludedLiquiditySources.splice(index, 1);
      updateSettings({ excludedLiquiditySources: [...excludedLiquiditySources] });
      return;
    }

    updateSettings({ excludedLiquiditySources: [...excludedLiquiditySources, id] });
  }

  if (isLoading) {
    return null;
  }

  const { liquiditySourcesList, excludedLiquiditySources } = settings;

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <ArrowBackIcon className={classes.pointer} onClick={onBackClick} />
        <Typography pl={1} color="textPrimary" variant="h6">
          Liquidity Sources
        </Typography>
      </Box>
      <MenuList>
        {liquiditySourcesList.map((l) => (
          <MenuItem key={l.id} onClick={() => onToggleLiquiditySource(l.id)}>
            <ListItemIcon>
              <img src={l.img} alt={l.id} height={24} width="auto" />
            </ListItemIcon>
            <ListItemText>{l.title}</ListItemText>
            <EulerCheckbox
              checked={excludedLiquiditySources.length === 0 || excludedLiquiditySources.indexOf(l.id) === -1}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Box>
  );
};

export default LiquiditySourcesContainer;
