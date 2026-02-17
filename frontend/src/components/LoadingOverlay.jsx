import React from 'react';
import { Zap } from 'lucide-react';

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 text-center space-y-6 animate-scale">
        {/* Loading Icon */}
        <div className="flex justify-center">
          <div className="relative size-20">
            <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="size-8 text-blue-600 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">Processing Order</h3>
          <p className="text-slate-600">
            Our servers are handling massive traffic. Please wait...
          </p>
        </div>

        {/* Status Messages */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700">Validating cart</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-700">Creating order</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-2 bg-slate-300 rounded-full"></div>
            <span className="text-sm text-slate-500">Confirming payment</span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-loading"></div>
        </div>

        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 100%; }
          }
          .animate-loading {
            animation: loading 2s ease-in-out infinite;
          }
          @keyframes scale {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale {
            animation: scale 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

export default LoadingOverlay;
