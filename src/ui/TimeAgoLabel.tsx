import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const TimeAgoTooltip = ({ verboseDate, children, ...rest }) => (
  <Tooltip {...rest} title={verboseDate || ''}>
    <Typography color="textPrimary">{children}</Typography>
  </Tooltip>
);

interface IProps {
  date: Date;
}

const TimeAgoLabel = ({ date }: IProps) => (
  <ReactTimeAgo date={date} timeStyle="round" tooltip={false} wrapperComponent={TimeAgoTooltip} />
);

export default TimeAgoLabel;
