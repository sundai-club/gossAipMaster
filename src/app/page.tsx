import QuizComponent from '@/components/QuizComponent';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
          GossAIPMaster
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Your ultimate companion for the hottest gossip and trending discussions
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Ready to Spill the Tea? 🫖
        </h2>
        
        <div className="mb-8 text-purple-200 space-y-4">
          <p className="text-lg leading-relaxed">
            Your ultimate companion to stay in the loop with all the hottest topics, trending debates, 
            and juiciest discussions from platforms like Reddit and Twitter.
          </p>
          <p className="text-lg leading-relaxed">
            Whether it's the latest celebrity feud, the most talked-about TV show, or the viral internet 
            moment everyone's dissecting, we've got you covered!
          </p>
        </div>

        <QuizComponent />
      </div>
    </main>
  );
}
