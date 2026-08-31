import _debounce from 'lodash/debounce';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { GridRowParams } from '@material-ui/data-grid';
import { selectYield } from 'src/selectors/yield';
import { getFarms } from 'src/slices/entities/yield';
import { useDispatch, useSelector } from 'src/store';
import { IFarmsDTO } from 'src/types/yield';
import { EulerError } from 'src/ui/EulerError';
import { EulerTable } from 'src/ui/EulerTable';
import { PageTitle } from 'src/ui/PageTitle';
import FarmDialog from './FarmDialog';
import { farmsTableColumns } from './FarmsTableColumns';

interface IProps {
  farmId?: string;
}

const FarmsContent = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading, filteredFarms, error } = useSelector(selectYield);
  const { network } = useParams();

  const [selectedFarm, setSelectedFarm] = useState<IFarmsDTO>(null);
  const [query, setQuery] = useState('');

  const { farmId = '' } = props;

  useEffect(() => {
    dispatch(getFarms(query));
  }, [query, network]);

  useEffect(() => {
    if (filteredFarms.length && farmId) {
      const _farm = filteredFarms.find((f) => f.id === farmId);

      if (_farm) {
        setSelectedFarm(_farm);
      }
    }
  }, [filteredFarms]);

  const onFilterChange = useCallback(
    _debounce((value) => {
      setQuery(value);
    }, 500),
    [],
  );

  const onChange = useCallback((event: ChangeEvent<{ value }>) => {
    onFilterChange(event.target.value);
  }, []);

  const onCloseDialog = () => {
    setSelectedFarm(null);
  };

  if (error) {
    return <EulerError error={error} />;
  }

  return (
    <>
      <Box display="grid" gridTemplateColumns="auto auto" columnGap={2}>
        <PageTitle title="Farms" />
        <Box display="flex" justifyContent="flex-end">
          <FormControl variant="standard">
            <TextField
              variant="standard"
              fullWidth
              placeholder={t('Filter')}
              name="filter"
              onChange={onChange}
              type="text"
            />
          </FormControl>
        </Box>
      </Box>
      <Card>
        <EulerTable
          rowHeight={58}
          rowsPerPageOptions={[16, 32, 64, 128]}
          table_id="farms-table"
          getRowId={(row) => row.id}
          rows={filteredFarms}
          rowCount={filteredFarms.length}
          columns={farmsTableColumns}
          loading={loading}
          paginationMode="client"
          components={{
            Toolbar: () => <></>,
          }}
          onRowClick={(rowParams: GridRowParams) => {
            const { row } = rowParams;

            setSelectedFarm(row as IFarmsDTO);
          }}
        />
      </Card>
      <FarmDialog farm={selectedFarm} onClose={onCloseDialog} />
    </>
  );
};

export default FarmsContent;
