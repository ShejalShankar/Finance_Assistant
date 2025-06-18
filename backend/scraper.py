import praw
import os
import json
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent="financial-insight-assistant"
)

subreddits = ["stocks", "wallstreetbets", "investing"]
post_limit = 15
FETCH_MODE = "top" 
TIME_FILTER = "week" 

def fetch_reddit_posts():
    posts = []
    seen_titles = set()

    for subreddit in subreddits:
        sub = reddit.subreddit(subreddit)

        if FETCH_MODE == "hot":
            submissions = sub.hot(limit=post_limit)
        elif FETCH_MODE == "new":
            submissions = sub.new(limit=post_limit)
        elif FETCH_MODE == "top":
            submissions = sub.top(time_filter=TIME_FILTER, limit=post_limit)
        else:
            raise ValueError(f"Unsupported FETCH_MODE: {FETCH_MODE}")

        for submission in submissions:
            title = submission.title.strip()
            text = submission.selftext.strip()
            if title in seen_titles:
                continue
            if submission.score < 3 or (not title and not text):
                continue

            posts.append({
                "title": title,
                "text": text,
                "score": submission.score,
                "url": submission.url,
                "created_utc": submission.created_utc,
                "subreddit": subreddit
            })
            seen_titles.add(title)

    return posts

if __name__ == "__main__":
    data = fetch_reddit_posts()
    with open("reddit_posts.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved {len(data)} posts to reddit_posts.json")
