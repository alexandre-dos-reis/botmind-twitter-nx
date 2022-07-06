interface Author {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Reply {
  likesCount: number;
  isCurrentUserHasLiked: boolean;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  image: string;
  parentTweetId: number;
  author: Author;
}

export interface Tweet {
  likesCount: number;
  isCurrentUserHasLiked: boolean;
  repliesCount: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  image: string;
  parentTweetId?: number;
  author: Author;
  replies: Reply[];
}

export interface TweetsResponse {
  tweets: Tweet[];
  tweetsCount: number;
}
