'use client';

import { useSearchParams } from 'next/navigation';
import GossipGame from '@/components/GossipGame';

export const dynamic = 'force-dynamic';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';

  return (
    <main className="min-h-screen relative">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
        <div className="stars absolute inset-0"></div>
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full">
          <GossipGame initialTopic={topic} />
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
      `}</style>
    </main>
  );
}
