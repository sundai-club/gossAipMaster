from reddit_scraper import RedditScraper
from question_generator import QuestionGenerator
from top_subreddits import SubredditFinder
import praw
import os
def main():
    # Initialize Reddit instance
    reddit = praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent=os.getenv("REDDIT_USER_AGENT")
    )

    # Step 1: Find top subreddits for the topic
    topic = "celebrity gossip"
    subreddit_finder = SubredditFinder(reddit)
    top_subreddits = subreddit_finder.find_top_subreddits(topic)

    if not top_subreddits:
        print("No relevant subreddits found. Exiting.")
        return

    # Step 2: Scrape data from the identified subreddits
    scraper = RedditScraper()
    scraped_data = scraper.scrape_subreddits(top_subreddits)

    # Step 3: Generate questions based on scraped data
    api_key = os.getenv("API_KEY")
    question_gen = QuestionGenerator(api_key)
    questions = question_gen.generate_questions([(post["Post Title"], post["Post URL"]) for post in scraped_data])

    # Step 4: Output generated questions
    for idx, q in enumerate(questions):
        print(f"Question {idx + 1} (Topic: {q['topic']}):\n{q['question']}")
        print(f"Post URL: {q['url']}\n")

if __name__ == "__main__":
    main()
