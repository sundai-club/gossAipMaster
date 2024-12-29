'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="mb-16 space-y-6">
          <h1 className="text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
              GossAIPMaster
            </span>
          </h1>
          <p className="text-2xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Your ultimate companion for staying in the loop with all the hottest topics
            and juiciest discussions.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold text-white">
              Ready to Spill the Tea? 🫖
            </h2>
            
            <div className="space-y-4 text-purple-200">
              <p className="text-lg">
                Whether it's celebrity drama, viral moments, or trending debates,
                we've got all the tea ready for you!
              </p>
              <p className="text-lg">
                Think you can keep up with the hottest gossip? Let's put your knowledge to the test!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-2xl mb-4 text-white font-medium text-center">
                  What do you want to gossip about?
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Celebrity drama? Tech world tea? You name it!"
                  className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-purple-300/30 
                           focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none 
                           text-white text-lg placeholder-purple-200/70 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 
                         hover:from-pink-600 hover:to-purple-600 rounded-xl text-xl font-bold
                         text-white transition-all transform hover:scale-105 focus:outline-none 
                         focus:ring-2 focus:ring-purple-400 shadow-lg disabled:opacity-50"
                disabled={!topic.trim()}
              >
                Let's Gossip! 💅
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </main>
  );
}
