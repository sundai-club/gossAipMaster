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
    const selectedIndex = currentQuestion.options.indexOf(selectedOption);
    
    const updatedState: QuizState = {
      ...quizState,
      selectedAnswer: selectedOption
    };

    if (selectedIndex === currentQuestion.correctAnswer) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Gossip AI Master</h2>
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-xl mb-4">{currentQuestion.text}</p>
        </div>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={quizState.selectedAnswer !== null}
              className={`
                w-full p-3 text-left rounded transition-colors duration-200
                ${quizState.selectedAnswer === option 
                  ? (index === currentQuestion.correctAnswer 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white')
                  : 'bg-blue-100 hover:bg-blue-200'}
                ${quizState.selectedAnswer !== null && index === currentQuestion.correctAnswer 
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
