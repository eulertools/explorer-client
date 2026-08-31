import { FC, useState, useMemo } from 'react';
import { lockerColumns } from 'src/pages/locker/components/LockerColumns';
import { LockToken } from 'src/types/locker';
import { EulerTable } from 'src/ui/EulerTable';

interface LockerTableProps {
  tokens: LockToken[];
}

const LockerTable: FC<LockerTableProps> = ({ tokens }) => {
  const [displayAge, setDisplayAge] = useState(false);

  const toggleDisplayAge = () => {
    setDisplayAge((prev) => !prev);
  };

  const columns = useMemo(() => lockerColumns({ displayAge, toggleDisplayAge }), [tokens, displayAge]);

  return (
    <EulerTable
      paginationMode="client"
      rows={tokens || []}
      getRowId={(row) => row.identifier}
      rowCount={tokens.length}
      columns={columns}
      loading={!tokens}
    />
  );
};

export default LockerTable;
