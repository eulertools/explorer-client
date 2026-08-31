import { useMemo, FC } from 'react';
import { EulerTable, EulerTableProps } from 'src/ui/EulerTable';
import { columnsCommonExchanges } from 'src/ui/eulerTable/eulerExchangeTable/columns';

interface ExchangeTableProps extends Omit<EulerTableProps, 'rows' | 'columns'> {
  currentAddress: string;
  exchanges: any[];
  displayAge: boolean;
  eulerView?: boolean;
}

export const EulerExchangeTable: FC<ExchangeTableProps> = ({
  exchanges,
  displayAge,
  currentAddress,
  eulerView = false,
  ...rest
}) => {
  const customColumns = useMemo(() => columnsCommonExchanges({ displayAge, eulerView }), [
    displayAge,
    currentAddress,
    eulerView,
  ]);
  return <EulerTable {...rest} rows={exchanges} columns={customColumns} />;
};
