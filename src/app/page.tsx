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
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
        {/* Animated stars */}
        <div className="stars absolute inset-0"></div>
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="mb-16 space-y-8">
            <div className="flex justify-center mb-12">
              <div className="relative w-48 h-48 animate-float group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 text-8xl flex items-center justify-center h-full transform group-hover:scale-110 transition-transform">
                  💭
                </div>
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-bold mb-8 animate-fade-in hover:scale-105 transition-transform cursor-default">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 hover:from-pink-300 hover:via-purple-200 hover:to-indigo-300">
                GossAIP
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-purple-100 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Your AI-powered gossip companion that knows all the juicy details
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto transform hover:scale-105 transition-all duration-300 border border-white/10">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-white flex items-center justify-center gap-3">
                Ready to Spill the Tea? 
                <span className="animate-bounce">🫖</span>
              </h2>
              
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-purple-100">
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
                    className="relative w-full px-6 py-4 md:px-8 md:py-6 rounded-xl bg-black/50 backdrop-blur-sm border-2 border-purple-300/50 
                             focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none 
                             text-white text-lg md:text-xl placeholder-purple-200/70 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden px-6 py-4 md:px-8 md:py-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
                           text-xl md:text-2xl font-bold text-white transition-all transform hover:scale-105 focus:outline-none 
                           focus:ring-2 focus:ring-purple-400 shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
                  disabled={!topic.trim()}
                >
                  <div className="absolute inset-0 w-3 bg-white transform skew-x-[20deg] group-hover:translate-x-[500px] transition-all duration-1000"></div>
                  Let's Gossip! 💅
                </button>
              </form>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 max-w-5xl mx-auto">
            {[
              { icon: '🎯', title: 'Trending Topics', desc: 'Stay updated with the hottest discussions' },
              { icon: '🔍', title: 'Deep Insights', desc: 'Get the inside scoop on any subject' },
              { icon: '🎮', title: 'Fun Quizzes', desc: 'Test your gossip knowledge' }
            ].map((feature, i) => (
              <div key={i} 
                   className="group bg-black/20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 
                            border border-white/10 hover:border-purple-500/50 hover:bg-black/30">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-purple-100 mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-purple-200/90 group-hover:text-purple-100 transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .stars {
          background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk2QkI4RkE3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk2QkI4RkI3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OTZCQjhGODc2MTYxMUU1QTg0RThGQjE2NDkxNjJEOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OTZCQjhGOTc2MTYxMUU1QTg0RThGQjE2NDkxNjJEOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq7th6IAAAB/SURBVHjaYvz//z8DECgoKHxnYGBgBGIBIP4DxSAMEwOJgAUq8B8JIwv8X7lyJZgGKfgPpYEYTQ0LVOAfEKMAZEUwAFIDVgBVBQKjCpHVoABYIUwRCKAohOnCJ4judvRgQlapgKwAqhBvmlXAVYNwEjQHFTDCMhMT4zsAAgwAyWSY2svfmrwAAAAASUVORK5CYII=) repeat;
          animation: animateStars 10s linear infinite;
        }
        @keyframes animateStars {
          from {background-position: 0 0;}
          to {background-position: 100px 100px;}
        }
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
