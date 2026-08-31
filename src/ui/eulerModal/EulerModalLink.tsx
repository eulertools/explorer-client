import React from 'react';
import { useDispatch } from 'react-redux';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import { GlobalModalItem, openModal } from 'src/slices/ui/globalModal';

interface EulerModalLinkProps extends GlobalModalItem {}

export const EulerModalLink = (props: EulerModalLinkProps) => {
  const { identifier } = props;
  const dispatch = useDispatch();
  const handleClick = React.useCallback(() => {
    dispatch(openModal(props));
  }, [props.identifier]);
  return (
    <Tooltip title={identifier}>
      <Link
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        onClick={handleClick}
      >
        {identifier}
      </Link>
    </Tooltip>
  );
};
