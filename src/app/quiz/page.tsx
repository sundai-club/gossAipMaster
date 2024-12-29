'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizComponent from '@/components/QuizComponent';

function QuizContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
          Let's Talk About {topic}! 🗣️
        </h1>
        <QuizComponent topic={topic || ''} />
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense 
        fallback={
          <div className="w-full max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <div className="text-2xl text-purple-200 animate-pulse">
                Loading your gossip session... 💭
              </div>
            </div>
          </div>
        }
      >
        <QuizContent />
      </Suspense>
    </main>
  );
}
