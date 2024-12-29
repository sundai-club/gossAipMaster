import praw
import os
from datetime import datetime, timedelta
import time

class RedditScraper:
    def __init__(self):
        self.reddit = self._initialize_reddit()

    def _initialize_reddit(self):
        client_id = os.getenv("REDDIT_CLIENT_ID")
        client_secret = os.getenv("REDDIT_CLIENT_SECRET")
        user_agent = os.getenv("REDDIT_USER_AGENT")
        
        if not all([client_id, client_secret, user_agent]):
            raise ValueError("Missing Reddit API credentials. Set them as environment variables.")
        
        return praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )

    def scrape_subreddits(self, subreddits, post_limit=100):
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        data = []

        for subreddit in subreddits:
            try:
                print(f"Scraping top posts from r/{subreddit} for the past week...")
                subreddit_instance = self.reddit.subreddit(subreddit)
                filtered_posts = self._filter_posts(subreddit_instance, one_week_ago, post_limit)
                top_posts = sorted(filtered_posts, key=lambda x: x['Score'], reverse=True)[:20]
                data.extend(top_posts)
                time.sleep(2)
            except Exception as e:
                print(f"Error scraping r/{subreddit}: {e}")

        return data

    def _filter_posts(self, subreddit_instance, one_week_ago, post_limit):
        filtered_posts = []
        for post in subreddit_instance.top(time_filter='week', limit=post_limit):
            post_date = datetime.utcfromtimestamp(post.created_utc)
            if (post_date >= one_week_ago and 
                post.score > 100 and 
                post.upvote_ratio > 0.9 and 
                self._is_text_based_post(post)):
                filtered_posts.append({
                    "Subreddit": subreddit_instance.display_name,
                    "Post Title": post.title,
                    "Post URL": post.url,
                    "Score": post.score,
                    "Upvote Ratio": post.upvote_ratio,
                    "Number of Comments": post.num_comments,
                    "Created Date": post_date,
                    "Text Content": post.selftext if post.is_self else post.title
                })
        return filtered_posts

    def _is_text_based_post(self, post):
        # Check if the post is a self post (text post)
        if post.is_self:
            return True
        
        # Check if the post has a self-explanatory title
        if len(post.title.split()) > 5:  # Assuming a self-explanatory title has more than 5 words
            return True
        
        # Exclude common image and video domains
        image_video_domains = ['i.redd.it', 'i.imgur.com', 'youtube.com', 'youtu.be', 'v.redd.it']
        if any(domain in post.url for domain in image_video_domains):
            return False
        
        return True
