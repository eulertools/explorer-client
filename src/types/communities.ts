interface MediaSizes {
  w: number;
  h: number;
  resize: string;
}

interface TweetMedia {
  id: number;
  id_str: string;
  indices: number[];
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: string;
  sizes: {
    thumb: MediaSizes;
    medium: MediaSizes;
    small: MediaSizes;
    large: MediaSizes;
  };
}

export interface TwitterTweet {
  id: string;
  content: string;
  timestamp: string;
  user: string;
  url: string;
  media?: TweetMedia[];
}

export interface MediumArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure?: any;
  categories: string[];
}
