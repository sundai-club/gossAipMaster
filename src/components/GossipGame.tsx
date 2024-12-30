'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Story {
  content: string;
  isReal: boolean;
  redditUrl?: string;
}

interface GossipResponse {
  topic: string;
  stories: Story[];
  correctIndex: number;
}

export default function GossipGame() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [revealed, setRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  const fetchGossip = async (searchTopic: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reddit?topic=${encodeURIComponent(searchTopic)}`);
      if (!response.ok) {
        const data = await response.json();
        if (data.suggestion) {
          setTopic(data.suggestion);
        }
        throw new Error(data.error || 'Failed to fetch gossip');
      }
      const data: GossipResponse = await response.json();
      setStories(data.stories);
      setCorrectIndex(data.correctIndex);
      setSelectedIndex(-1);
      setRevealed(false);
    } catch (error) {
      console.error('Error fetching gossip:', error);
      alert(error instanceof Error ? error.message : 'Failed to fetch gossip');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setTimeLeft(60); // 1 minute
    setGameOver(false);
    if (topic) {
      fetchGossip(topic);
    }
  };

  const handleNextGossip = () => {
    if (topic) {
      fetchGossip(topic);
    }
  };

  const handleGuess = (index: number) => {
    if (selectedIndex === -1 && !revealed) {
      setSelectedIndex(index);
      setRevealed(true);
      setAttempts(prev => prev + 1);
      if (index === correctIndex) {
        setScore(prev => prev + 1);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFunScoreMessage = (score: number, attempts: number) => {
    const accuracy = attempts > 0 ? (score / attempts) * 100 : 0;
    
    if (attempts === 0) return "Cold feet? You haven't even started spilling the tea! 🫖";
    
    if (accuracy === 100) {
      return "OMG! You're the Queen/King of Gossip! TMZ should hire you ASAP! 👑";
    } else if (accuracy >= 80) {
      return "Yasss! You're serving hot tea like a pro! Spill it, bestie! ☕️";
    } else if (accuracy >= 60) {
      return "Not bad, honey! You've got the gossip game going! 💅";
    } else if (accuracy >= 40) {
      return "Hmm... you're more E! News than TMZ, but keep practicing! 📺";
    } else if (accuracy >= 20) {
      return "Sweetie, you're believing everything you read on Facebook! 🤦‍♀️";
    } else {
      return "Bless your heart... Maybe stick to reading the weather forecast? 🌤️";
    }
  };

  if (gameOver) {
    const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
    const message = getFunScoreMessage(score, attempts);
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Tea Time's Over!</h2>
        <div className="text-center space-y-4 text-white">
          <p className="text-2xl mb-4">{message}</p>
          <p className="text-xl">Spilled Tea Score: {score}</p>
          <p className="text-xl">Gossip Attempts: {attempts}</p>
          <p className="text-xl">Gossip Accuracy: {accuracy}%</p>
          <button
            onClick={handleStartGame}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Spill More Tea! 🫖
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Gossip Game</h1>
        <div className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What's the tea about...?"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 backdrop-blur-sm"
          />
          <button
            onClick={handleStartGame}
            disabled={!topic}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start 1-Minute Tea Time! ☕️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
      <div className="mb-6 flex justify-between items-center text-white">
        <div>Score: {score}</div>
        <div>Time Left: {formatTime(timeLeft)}</div>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-white">Loading gossip...</div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Topic: {topic}</h2>
          
          <div className="space-y-4">
            {stories.map((story, index) => (
              <div
                key={index}
                onClick={() => handleGuess(index)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  revealed
                    ? index === correctIndex
                      ? 'bg-green-500/20'
                      : 'bg-red-500/20'
                    : selectedIndex === index
                    ? 'bg-purple-500/20'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <p className="text-white">{story.content}</p>
                {revealed && index === correctIndex && story.redditUrl && (
                  <a
                    href={story.redditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-400 text-sm mt-2 block"
                  >
                    View on Reddit →
                  </a>
                )}
              </div>
            ))}
          </div>
          
          {revealed && (
            <button
              onClick={handleNextGossip}
              className="w-full mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next Gossip!
            </button>
          )}
        </div>
      )}
    </div>
  );
}
