import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, ArrowRight } from 'lucide-react';

function OrderModal({ orderId, onClose }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-success">
        {/* Success Icon */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl"></div>
            <CheckCircle2 className="size-20 text-green-600 relative animate-bounce" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Order Confirmed!</h2>
            <p className="text-slate-600">
              Your order has been successfully processed by our serverless infrastructure.
            </p>
          </div>

          {/* Order ID */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Order ID</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-lg font-mono font-bold text-blue-600 break-all">{orderId}</code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition flex-shrink-0"
              >
                <Copy className="size-5" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 font-semibold">Copied to clipboard!</p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Status</span>
              <span className="font-bold text-green-600">✓ Confirmed</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Processing</span>
              <span className="text-sm text-blue-600">AWS Lambda</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Database</span>
              <span className="text-sm text-blue-600">DynamoDB</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-600">
            📧 A confirmation email has been sent to your inbox. Keep your Order ID for reference.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={onClose}
              className="w-full py-4 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="size-5" />
            </button>
          </div>

          {/* Tech Stack Note */}
          <p className="text-xs text-slate-500 border-t border-slate-200 pt-4">
            🚀 This order was processed by AWS Serverless infrastructure handling massive traffic spikes.
          </p>
        </div>

        <style>{`
          @keyframes success {
            0% {
              opacity: 0;
              transform: scale(0.9) rotateX(10deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotateX(0deg);
            }
          }
          .animate-success {
            animation: success 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}</style>
      </div>
    </div>
  );
}

export default OrderModal;
