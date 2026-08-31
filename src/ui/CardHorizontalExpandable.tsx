import React from 'react';
import { CardContent, Collapse } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { useResponsiveValues } from 'src/hooks/useResponsiveValues';
import { Separator } from './Separator';

interface CardHorizontalProps {
  header: React.ReactElement;
  content: React.ReactElement;
  expandContent: React.ReactElement;
  expanded?: boolean;
}

export const CardHorizontalExpandable = (props: CardHorizontalProps) => {
  const media = useResponsiveValues();
  const { header, content, expandContent, expanded } = props;
  const [isExpanded, setExpanded] = React.useState(expanded);
  React.useEffect(() => setExpanded(expanded), [expanded]);
  const handleClick = React.useCallback(() => setExpanded(!isExpanded), [isExpanded]);
  return (
    <Card style={{ cursor: 'pointer' }} onClick={handleClick}>
      <Box
        display="grid"
        gridTemplateColumns={!media.isMobile ? 'minmax(120px, 300px) 1fr 50px' : undefined}
        gridTemplateRows={media.isMobile ? 'auto auto' : undefined}
      >
        {header}
        {content}
        {media.isMobile ? null : (
          <Box display="grid" alignItems="center" justifyContent="center">
            <ArrowRight
              style={{ transform: !isExpanded ? ' rotate(0)' : 'rotate(90deg)', transition: 'all .2s ease-in-out' }}
              fontSize="large"
            />
          </Box>
        )}
      </Box>
      <Collapse in={isExpanded}>
        <Box>
          <Separator />
          <Box pl={3} pr={3}>
            <CardContent>{expandContent}</CardContent>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};
