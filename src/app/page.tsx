'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="mb-16 space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48 animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                <Image
                  src="/gossip-icon.png"
                  alt="GossAIP Icon"
                  width={192}
                  height={192}
                  className="relative z-10"
                  priority
                />
              </div>
            </div>
            <h1 className="text-8xl font-bold mb-6 animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
                GossAIP
              </span>
            </h1>
            <p className="text-3xl text-purple-200 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
              Your AI-powered gossip companion that knows all the juicy details
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto transform hover:scale-105 transition-all duration-300">
            <div className="space-y-8">
              <h2 className="text-4xl font-semibold text-white flex items-center justify-center gap-3">
                Ready to Spill the Tea? 
                <span className="animate-bounce">🫖</span>
              </h2>
              
              <div className="space-y-4 text-purple-200">
                <p className="text-xl">
                  From celebrity scandals to tech world drama, I've got all the hot gossip ready for you!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Celebrity drama? Tech world tea? You name it!"
                    className="relative w-full px-8 py-6 rounded-xl bg-black/50 backdrop-blur-sm border-2 border-purple-300/30 
                             focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none 
                             text-white text-xl placeholder-purple-200/70 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden px-8 py-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
                           text-2xl font-bold text-white transition-all transform hover:scale-105 focus:outline-none 
                           focus:ring-2 focus:ring-purple-400 shadow-lg disabled:opacity-50"
                  disabled={!topic.trim()}
                >
                  <div className="absolute inset-0 w-3 bg-white transform skew-x-[20deg] group-hover:translate-x-[500px] transition-all duration-1000"></div>
                  Let's Gossip! 💅
                </button>
              </form>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {[
              { icon: '🎯', title: 'Trending Topics', desc: 'Stay updated with the hottest discussions' },
              { icon: '🔍', title: 'Deep Insights', desc: 'Get the inside scoop on any subject' },
              { icon: '🎮', title: 'Fun Quizzes', desc: 'Test your gossip knowledge' }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-purple-200 mb-2">{feature.title}</h3>
                <p className="text-purple-300/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
