import { EulerIconArrowLeft1, EulerIconArrowRight1 } from '@eulertools/ui';
import { FC, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { selectFilterState } from 'src/selectors/filters';
import { selectAssetsNFTList } from 'src/selectors/nft';
import { GlobalFilterProps } from 'src/slices/filter.types';
import { setFilterTable } from 'src/slices/ui/filters';
import { useDispatch, useSelector } from 'src/store';

export const FilterNFTPagination: FC<GlobalFilterProps> = ({ tableId }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilterState(tableId));
  const { total, cursors } = useSelector(selectAssetsNFTList);
  const { page, size } = filters.filter;

  const totalPages = useMemo(() => Math.ceil(total / size), [size, total]);

  const onPreviousPage = () => {
    if (page !== 0) {
      dispatch(
        setFilterTable(tableId, {
          ...filters.filter,
          page: page - 1,
          cursor: cursors[page - 2],
        }),
      );
    }
  };

  const onNextPage = () => {
    if (page < totalPages) {
      dispatch(
        setFilterTable(tableId, {
          ...filters.filter,
          page: page + 1,
          cursor: cursors[page],
        }),
      );
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 600,
          lineHeight: '17px',
          color: (theme) => (theme as any).palette.terciary[700],
        }}
      >
        Page {page} of {totalPages}
      </Typography>
      <IconButton onClick={onPreviousPage} disabled={page === 1} sx={{ padding: (theme) => theme.spacing(0) }}>
        <EulerIconArrowLeft1 size="s" colorLight="terciary-700" colorDark="terciary-700" />
      </IconButton>
      <IconButton onClick={onNextPage} disabled={page === totalPages} sx={{ padding: (theme) => theme.spacing(0) }}>
        <EulerIconArrowRight1 size="s" colorLight="terciary-700" colorDark="terciary-700" />
      </IconButton>
    </Box>
  );
};
