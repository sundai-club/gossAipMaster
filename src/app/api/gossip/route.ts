import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GossipStory } from '@/types/gossip';

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
      `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=top&t=week&limit=20`,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
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
    if (posts.length === 0) {
      throw new Error('No posts found');
    }

    // Select top 10 most engaging posts
    const topPosts = posts
      .sort((a: any, b: any) => (b.score * 1.5 + b.num_comments) - (a.score * 1.5 + a.num_comments))
      .slice(0, 10);

    // Prepare content for GPT
    const postsContent = topPosts.map((post: any) =>
      `Title: ${post.title}\nContent: ${post.selftext?.substring(0, 200) || post.title}`
    ).join('\n\n');

    // Generate the real gossip summary
    const realGossipResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a gossip columnist. Create a short, engaging, and playful summary of news and stories in a gossip style, based on multiple Reddit posts."
        },
        {
          role: "user",
          content: `Summarize these top Reddit posts into a cohesive, playful, gossip-style short summary (max 2-3 sentences):\n\n${postsContent}`
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
          content: "Generate two short, fictional but believable gossip stories about the given topic. Make them engaging and playful, matching the concise style of the real gossip."
        },
        {
          role: "user",
          content: `Create two different fictional gossip stories (2-3 sentences each) about "${topic}" that are similar in style to this real gossip:\n"${realGossip}"`
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const fakeGossips = fakeGossipResponse.choices[0].message.content?.split('\n\n')
      .filter(gossip => gossip.trim().length > 0)
      .slice(0, 2) || [];

    // Create the stories array and shuffle
    const stories: GossipStory[] = [
      { content: realGossip, isReal: true, redditUrl: `https://reddit.com/search?q=${encodeURIComponent(topic)}` },
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
