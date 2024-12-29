'use client';

import { useState, useEffect, useCallback } from 'react';
import { GossipStory, GossipGameState } from '@/types/gossip';

interface GossipGameProps {
  initialTopic?: string;
  gameDuration?: number; // in seconds
}

export default function GossipGame({ initialTopic = '', gameDuration = 120 }: GossipGameProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<GossipStory[]>([]);
  const [gameState, setGameState] = useState<GossipGameState>({
    selectedIndex: null,
    isRevealed: false,
    correctIndex: -1,
    score: 0,
    timeLeft: gameDuration,
    isGameActive: false,
    totalAttempts: 0
  });
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isGameActive && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isGameActive) {
      endGame();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.isGameActive, gameState.timeLeft]);

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

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isGameActive: true,
      timeLeft: gameDuration,
      score: 0,
      totalAttempts: 0
    }));
    fetchGossip();
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isGameActive: false
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startGame();
  };

  const handleStorySelect = (index: number) => {
    if (!gameState.isRevealed && gameState.isGameActive) {
      const isCorrect = index === gameState.correctIndex;
      setGameState(prev => ({
        ...prev,
        selectedIndex: index,
        isRevealed: true,
        score: isCorrect ? prev.score + 1 : prev.score,
        totalAttempts: prev.totalAttempts + 1
      }));
    }
  };

  const nextGossip = () => {
    if (gameState.timeLeft > 0) {
      setStories([]);
      setGameState(prev => ({
        ...prev,
        selectedIndex: null,
        isRevealed: false,
        correctIndex: -1
      }));
      fetchGossip();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!gameState.isGameActive) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        {gameState.totalAttempts > 0 && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-4">Game Over!</h2>
            <p className="text-xl text-purple-200">Final Score: {gameState.score}/{gameState.totalAttempts}</p>
            <p className="text-lg text-purple-300 mt-2">
              Accuracy: {((gameState.score / gameState.totalAttempts) * 100).toFixed(1)}%
            </p>
          </div>
        )}
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
            Start {gameDuration / 60}-Minute Challenge!
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-xl text-purple-200">
          Score: {gameState.score}/{gameState.totalAttempts}
        </div>
        <div className="text-xl text-purple-200">
          Time: {formatTime(gameState.timeLeft)}
        </div>
      </div>

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
            onClick={nextGossip}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Next Gossip!
          </button>
        </div>
      )}
    </div>
  );
}
