export interface GossipStory {
  content: string;
  isReal: boolean;
  redditUrl?: string;
}

export interface GossipGameState {
  selectedIndex: number | null;
  isRevealed: boolean;
  correctIndex: number;
  score: number;
  timeLeft: number;
  isGameActive: boolean;
  totalAttempts: number;
}
