import { Question } from '@/types/quiz';

export const quizQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    topic: 'Geography'
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    topic: 'Science'
  },
  {
    id: '3',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    topic: 'Math'
  }
];
