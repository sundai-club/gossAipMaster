import praw
import os

class SubredditFinder:
    def __init__(self, reddit_instance):
        self.reddit = reddit_instance

    def find_top_subreddits(self, topic, limit=10):
        """
        Finds the top subreddits related to a specific topic, ranked by subscriber count.
        
        Args:
            topic (str): The keyword or topic to search for.
            limit (int): The number of top subreddits to return.

        Returns:
            list: A list of subreddit names sorted by subscriber count.
        """
        try:
            print(f"Searching for subreddits related to '{topic}'...")
            subreddits = list(self.reddit.subreddits.search(topic, limit=50))  # Fetch more results initially
            # Sort by subscriber count and handle None values gracefully
            sorted_subreddits = sorted(
                subreddits,
                key=lambda x: x.subscribers if x.subscribers else 0,
                reverse=True
            )
            top_subreddits = sorted_subreddits[:limit]
            
            # Print and return the top subreddit names
            subreddit_names = [sub.display_name for sub in top_subreddits]
            print(f"Top {limit} Subreddits for '{topic}':")
            for idx, sub in enumerate(top_subreddits, start=1):
                print(f"{idx}. {sub.display_name} ({sub.subscribers} subscribers) - {sub.public_description}")
            
            return subreddit_names
        except Exception as e:
            print(f"Error finding subreddits: {e}")
            return []
