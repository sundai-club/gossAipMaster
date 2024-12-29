import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchRedditPosts(topic: string) {
  const response = await fetch(
    `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=top&t=week&limit=5`,
    {
      headers: {
        'User-Agent': 'GossAIP/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Reddit');
  }

  const data = await response.json();
  return data.data.children.map((child: any) => child.data);
}

async function generateFakeGossip(realGossip: string, topic: string) {
  const prompt = `Given this real gossip about "${topic}":
  "${realGossip}"
  
  Generate a fictional but believable gossip story about the same topic. Make it engaging and playful, matching the tone of the real gossip. The story should be different but equally plausible.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a creative gossip writer. Generate engaging, playful, and believable gossip stories that match the tone of real gossip but are entirely fictional."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  return response.choices[0].message.content?.trim() || '';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      const trendingResponse = await fetch('https://www.reddit.com/r/popular/hot.json?limit=1');
      const trendingData = await trendingResponse.json();
      const trendingTopic = trendingData.data.children[0].data.title;
      return NextResponse.json({ error: 'Topic is required', suggestion: trendingTopic }, { status: 400 });
    }

    const posts = await fetchRedditPosts(topic);
    if (posts.length === 0) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    // Select the most engaging post
    const bestPost = posts.reduce((best: any, current: any) => {
      const bestScore = best.score * 1.5 + best.num_comments;
      const currentScore = current.score * 1.5 + current.num_comments;
      return currentScore > bestScore ? current : best;
    });

    // Generate the real gossip summary
    const realGossipResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a gossip columnist. Create engaging, playful summaries of news and stories in a gossip style."
        },
        {
          role: "user",
          content: `Summarize this Reddit post into a playful, gossip-style paragraph:
          Title: ${bestPost.title}
          Content: ${bestPost.selftext?.substring(0, 500) || bestPost.title}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const realGossip = realGossipResponse.choices[0].message.content?.trim() || '';

    // Generate two fake gossip stories
    const fakeGossipResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate two fictional but believable gossip stories about the given topic. Make them engaging and playful."
        },
        {
          role: "user",
          content: `Create two different fictional gossip stories about "${topic}" that are similar in style to this real gossip:
          "${realGossip}"`
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const fakeGossips = fakeGossipResponse.choices[0].message.content?.split('\n\n')
      .filter(gossip => gossip.trim().length > 0)
      .slice(0, 2) || [];

    // Create the stories array and shuffle
    const stories = [
      { content: realGossip, isReal: true, redditUrl: `https://reddit.com${bestPost.permalink}` },
      ...fakeGossips.map(content => ({ content, isReal: false }))
    ];

    // Shuffle the stories
    const shuffledStories = [...stories].sort(() => Math.random() - 0.5);
    const correctIndex = shuffledStories.findIndex(story => story.isReal);

    return NextResponse.json({
      topic,
      stories: shuffledStories,
      correctIndex
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate gossip' }, { status: 500 });
  }
}
