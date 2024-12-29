'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/questions';
import { useRouter } from 'next/navigation';

interface QuizComponentProps {
  topic: string;
}

export default function QuizComponent({ topic }: QuizComponentProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null,
    isQuizComplete: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [timerActive, setTimerActive] = useState(false);

  const startTimer = useCallback(() => {
    setTimerActive(true);
    setTimeRemaining(20);
  }, []);

  const goToHomePage = () => {
    router.push('/');
  };

  useEffect(() => {
    const fetchQuestions = async () => {
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
  }, [topic]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      timerId = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timeRemaining === 0) {
      // Time's up, end the quiz
      setQuizState(prev => ({
        ...prev,
        isQuizComplete: true
      }));
      setTimerActive(false);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    // Start timer when first question loads
    if (questions.length > 0 && !timerActive) {
      startTimer();
    }
  }, [questions, timerActive, startTimer]);

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
      setTimerActive(false);
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      isQuizComplete: false
    });
    startTimer();
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
          onClick={goToHomePage}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 
                   hover:from-pink-600 hover:to-purple-600 rounded-xl text-xl 
                   text-white transition-all transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white text-lg">
          Question {quizState.currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className={`text-xl font-bold ${timeRemaining <= 5 ? 'text-red-500' : 'text-white'}`}>
          Time: {timeRemaining}s
        </div>
        <div className="text-white text-lg">
          Current Score: {quizState.score}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-xl text-white mb-4">{currentQuestion.text}</p>
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
