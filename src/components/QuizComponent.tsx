'use client';

import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/questions';

export default function QuizComponent() {
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
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">Error Loading Quiz</p>
          <p className="text-lg text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (quizState.isQuizComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-xl mb-4">Your Score: {quizState.score} / {questions.length}</p>
        <button 
          onClick={resetQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Game</h2>
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-xl mb-4">{currentQuestion.text}</p>
        </div>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={quizState.selectedAnswer !== null}
              className={`
                w-full p-3 text-left rounded transition-colors duration-200
                ${quizState.selectedAnswer === option 
                  ? (option === currentQuestion.correctAnswer 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white')
                  : 'bg-blue-100 hover:bg-blue-200'}
                ${quizState.selectedAnswer !== null && option === currentQuestion.correctAnswer 
                  ? 'bg-green-500 text-white' 
                  : ''}
              `}
            >
              {option}
            </button>
          ))}
        </div>
        {quizState.selectedAnswer && (
          <div className="mt-4 text-center">
            <button 
              onClick={moveToNextQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Next Question
            </button>
          </div>
        )}
        <div className="mt-4 text-center text-gray-600">
          Current Score: {quizState.score}
        </div>
      </div>
    </div>
  );
}
