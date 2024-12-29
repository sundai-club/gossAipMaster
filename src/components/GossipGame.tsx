'use client';

import { useState } from 'react';
import { GossipStory, GossipGameState } from '@/types/gossip';

interface GossipGameProps {
  initialTopic?: string;
}

export default function GossipGame({ initialTopic = '' }: GossipGameProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<GossipStory[]>([]);
  const [gameState, setGameState] = useState<GossipGameState>({
    selectedIndex: null,
    isRevealed: false,
    correctIndex: -1
  });
  const [error, setError] = useState<string | null>(null);

  const fetchGossip = async (userTopic?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gossip?topic=${encodeURIComponent(userTopic || topic)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gossip');
      }
      const data = await response.json();
      setStories(data.stories);
      setGameState(prev => ({ ...prev, correctIndex: data.correctIndex }));
    } catch (err) {
      setError('Failed to fetch gossip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGossip();
  };

  const handleStorySelect = (index: number) => {
    if (!gameState.isRevealed) {
      setGameState(prev => ({
        ...prev,
        selectedIndex: index,
        isRevealed: true
      }));
    }
  };

  const playAgain = () => {
    setStories([]);
    setTopic('');
    setGameState({
      selectedIndex: null,
      isRevealed: false,
      correctIndex: -1
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => fetchGossip()}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-lg mb-2 text-purple-100">
              Enter a topic for gossip (or leave empty for trending topics)
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-500/50 text-white focus:outline-none focus:border-purple-500"
              placeholder="Celebrity, Tech, Sports, etc."
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Get the Gossip!
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-purple-100 mb-6">
        {gameState.isRevealed ? "Here's the Truth!" : "Can You Spot the Real Gossip?"}
      </h2>
      <p className="text-xl text-center text-purple-200 mb-8">Topic: {topic}</p>

      <div className="space-y-6">
        {stories.map((story, index) => (
          <div
            key={index}
            onClick={() => !gameState.isRevealed && handleStorySelect(index)}
            className={`p-6 rounded-xl transition-all cursor-pointer ${
              gameState.isRevealed
                ? story.isReal
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : gameState.selectedIndex === index
                  ? 'bg-red-500/20 border-2 border-red-500'
                  : 'bg-black/30'
                : 'bg-black/30 hover:bg-black/40 border border-purple-500/30'
            }`}
          >
            <p className="text-lg mb-2">{story.content}</p>
            {gameState.isRevealed && story.isReal && story.redditUrl && (
              <a
                href={story.redditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline block mt-2"
              >
                View Original Reddit Thread →
              </a>
            )}
          </div>
        ))}
      </div>

      {gameState.isRevealed && (
        <div className="text-center mt-8">
          <p className="text-xl mb-4">
            {gameState.selectedIndex === gameState.correctIndex
              ? "🎉 You've got a nose for real gossip!"
              : "Oops! That was a creative fake. The real tea was option " + (gameState.correctIndex + 1)}
          </p>
          <button
            onClick={playAgain}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Play Again!
          </button>
        </div>
      )}
    </div>
  );
}
