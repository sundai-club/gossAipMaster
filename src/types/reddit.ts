export interface RedditPost {
  title: string;
  selftext: string;
  url: string;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
}

export interface GossipOption {
  content: string;
  isReal: boolean;
  redditUrl?: string;
  explanation?: string;
}

export interface GossipGame {
  topic: string;
  options: GossipOption[];
  correctIndex: number;
  selectedIndex?: number;
  isRevealed: boolean;
}
