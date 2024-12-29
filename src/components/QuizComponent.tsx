'use client';

import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/questions';

interface QuizComponentProps {
  topic: string;
}

export default function QuizComponent({ topic }: QuizComponentProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null,
    isQuizComplete: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedQuestions = await response.json();
        
        if (!fetchedQuestions || fetchedQuestions.length === 0) {
          throw new Error('No questions received');
        }

        setQuestions(fetchedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        // Fallback to local questions if API fails
        setQuestions(quizQuestions);
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [topic]); // Add topic as dependency

  const handleAnswerSelect = (selectedOption: string) => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    
    const updatedState: QuizState = {
      ...quizState,
      selectedAnswer: selectedOption
    };

    if (selectedOption === currentQuestion.correctAnswer) {
      updatedState.score += 1;
    }

    setQuizState(updatedState);
  };

  const moveToNextQuestion = () => {
    const nextQuestionIndex = quizState.currentQuestionIndex + 1;
    
    if (nextQuestionIndex < questions.length) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextQuestionIndex,
        selectedAnswer: null
      });
    } else {
      setQuizState({
        ...quizState,
        isQuizComplete: true
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      isQuizComplete: false
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-2xl text-purple-200 animate-pulse">
          Preparing your gossip quiz... 🤫
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 text-xl mb-4">Oops! Something went wrong:</p>
        <p className="text-purple-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizState.isQuizComplete) {
    return (
      <div className="text-center space-y-6 p-8">
        <h2 className="text-3xl font-bold text-purple-200">Quiz Complete! 🎉</h2>
        <p className="text-2xl text-white">
          Your Score: {quizState.score} out of {questions.length}
        </p>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 
                   hover:from-pink-600 hover:to-purple-600 rounded-xl text-xl 
                   text-white transition-all transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-purple-200 text-lg">
          Question {quizState.currentQuestionIndex + 1} of {questions.length}
        </p>
        <h3 className="text-2xl font-medium text-white">
          {currentQuestion.text}
        </h3>
      </div>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={quizState.selectedAnswer !== null}
            className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-102
                     ${quizState.selectedAnswer === null 
                       ? 'bg-white/20 hover:bg-white/30 text-white' 
                       : quizState.selectedAnswer === option
                         ? option === currentQuestion.correctAnswer
                           ? 'bg-green-500/50 text-white'
                           : 'bg-red-500/50 text-white'
                         : option === currentQuestion.correctAnswer
                           ? 'bg-green-500/50 text-white'
                           : 'bg-white/20 text-white opacity-50'
                     }`}
          >
            {option}
          </button>
        ))}
      </div>

      {quizState.selectedAnswer && (
        <button
          onClick={moveToNextQuestion}
          className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 
                   hover:from-pink-600 hover:to-purple-600 rounded-xl text-xl 
                   text-white transition-all transform hover:scale-105"
        >
          {quizState.currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
