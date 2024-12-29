export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: string | null;
  isQuizComplete: boolean;
}
