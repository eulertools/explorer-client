import { FC } from 'react';

interface TwitterFeedItemProps {
  date: number;
  user: string;
  message: string;
  link: string;
  img: string;
}

interface TwitterFeedWidgetProps {
  feed: TwitterFeedItemProps[];
}

const TwitterFeedWidget: FC<TwitterFeedWidgetProps> = () => (
  <>
    {
      // eslint-disable-next-line react/prop-types
      // feed.map((feedItem) => <TwitterFeedItem feedData={feedItem} />)
    }
  </>
);
export default TwitterFeedWidget;
