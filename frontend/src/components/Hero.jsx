import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

function Hero() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 size-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 size-80 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          {/* Flash Sale Badge */}
          <div className="inline-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-full text-red-200 text-sm font-semibold">
              <Flame className="size-4" />
              Flash Sale Event
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Tech Deals You <span className="text-blue-400">Can't Miss</span>
          </h2>

          {/* Subheading */}
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Limited inventory available. Grab your premium tech gadgets at unbeatable prices before stock runs out.
          </p>

          {/* Timer */}
          <div className="flex justify-center items-center gap-3 bg-white/10 border border-white/20 rounded-lg px-6 py-4 inline-block">
            <Clock className="size-6 text-blue-400 animate-pulse" />
            <div className="text-center">
              <p className="text-sm text-slate-300">Sale Ends In</p>
              <p className="text-2xl font-bold text-blue-300">{timeLeft || 'Loading...'}</p>
            </div>
          </div>

          {/* CTA Text */}
          <p className="text-slate-400 text-sm">
            ⚡ Heavy traffic expected • Prices automatically enforced • Limited time offer
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </section>
  );
}

export default Hero;
