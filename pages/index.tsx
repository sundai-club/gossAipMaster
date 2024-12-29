import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the quiz start here
    console.log('Starting quiz with topic:', userInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
      <Head>
        <title>GossAIPMaster - Your Ultimate Gossip Companion</title>
        <meta name="description" content="Stay in the loop with all the hottest topics and trending debates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
            GossAIPMaster
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Your ultimate companion for the hottest gossip and trending discussions
          </p>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-12">
          <Image
            src="/gossip-ai.png"
            alt="GossAIPMaster Character"
            layout="fill"
            objectFit="contain"
            className="animate-float"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Ready to Spill the Tea? 🫖
          </h2>
          
          <p className="text-lg mb-8 text-purple-200 leading-relaxed">
            Whether it's the latest celebrity drama, viral moments, or trending debates,
            we've got all the tea! Think you can keep up with the hottest gossip?
            Let's put your knowledge to the test!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gossip-topic" className="block text-xl mb-4 text-center font-medium">
                What do you want to gossip about?
              </label>
              <input
                type="text"
                id="gossip-topic"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Celebrity drama? Tech world tea? You name it!"
                className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-purple-300/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all placeholder-purple-200/70 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
            >
              Start Spilling! 💅
            </button>
          </form>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
