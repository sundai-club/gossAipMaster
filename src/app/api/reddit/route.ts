import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchRedditPosts(topic: string) {
  try {
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=top&t=week&limit=5`,
      {
        headers: {
          'User-Agent': 'GossAIP/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.data?.children?.length) {
      throw new Error('No posts found');
    }

    return data.data.children.map((child: any) => child.data);
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    throw error;
  }
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
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');

    if (!topic) {
      try {
        const trendingResponse = await fetch('https://www.reddit.com/r/popular/hot.json?limit=1', {
          headers: {
            'User-Agent': 'GossAIP/1.0',
          },
        });

        if (!trendingResponse.ok) {
          throw new Error('Failed to fetch trending topics');
        }

        const trendingData = await trendingResponse.json();
        const trendingTopic = trendingData?.data?.children?.[0]?.data?.title;

        if (!trendingTopic) {
          throw new Error('No trending topics found');
        }

        return NextResponse.json({ error: 'Topic is required', suggestion: trendingTopic }, { status: 400 });
      } catch (error) {
        console.error('Error fetching trending topic:', error);
        return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
      }
    }

    const posts = await fetchRedditPosts(topic);
    
    // Select the most engaging post
    const bestPost = posts.reduce((best: any, current: any) => {
      const bestScore = (best.score || 0) * 1.5 + (best.num_comments || 0);
      const currentScore = (current.score || 0) * 1.5 + (current.num_comments || 0);
      return currentScore > bestScore ? current : best;
    }, posts[0]);

    if (!bestPost) {
      return NextResponse.json({ error: 'No suitable posts found' }, { status: 404 });
    }

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
      .filter(gossip => gossip?.trim()?.length > 0)
      .slice(0, 2) || [];

    if (fakeGossips.length < 2) {
      throw new Error('Failed to generate fake gossip stories');
    }

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
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate gossip'
    }, { 
      status: 500 
    });
  }
}
