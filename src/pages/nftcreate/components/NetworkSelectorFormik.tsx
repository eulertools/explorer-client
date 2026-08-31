import { useSnackbar } from 'notistack';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectProps, Typography, useTheme } from '@material-ui/core';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import { supportedChains } from 'src/types/blockchain';
import { getCollectionQuery } from '../apicalls/bodybuildercollection';
import { searchCollections } from '../apicalls/collection';

type NetworkSelectorFormikProps = SelectProps & {
  helpertext: string;
};

export const NetworkSelectorFormik: FC<NetworkSelectorFormikProps> = ({ ...props }: NetworkSelectorFormikProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    urls: { nft_api },
  } = useContext(ConfigurationContext);
  const [collections, setCollections] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const getCollections = async () => {
    try {
      const query = getCollectionQuery({ kind: 'generic-managed', user_sub: 'default' });
      const res = await searchCollections(nft_api, query);
      const { results } = res.data;
      setCollections(results);
    } catch (e) {
      enqueueSnackbar(t('The collections could not be loaded, please try again later'), {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
        autoHideDuration: 2500,
        variant: 'error',
      });
    }
  };
  useEffect(() => {
    getCollections();
  }, []);

  const inputLabel = t('Select a network');
  return (
    <FormControl>
      <InputLabel>{inputLabel}</InputLabel>
      <Select
        label={inputLabel}
        {...props}
        sx={{
          '& > .MuiSelect-root ': {
            background: theme.palette.background.paper,
          },
          '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.disabled,
          },
        }}
      >
        {collections.map((chain) => {
          const collection = supportedChains.find((n) => n.value === chain.blockchain);
          return (
            <MenuItem key={collection.value} value={collection.value}>
              <Box display="flex" alignItems="center" gap={2}>
                <img alt="Logo" width="20px" src={collection.iconSrc} />
                {collection.chainName}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
      <Typography ml={2} variant="caption" color={theme.palette.error.main}>
        {props.helpertext}
      </Typography>
    </FormControl>
  );
};
