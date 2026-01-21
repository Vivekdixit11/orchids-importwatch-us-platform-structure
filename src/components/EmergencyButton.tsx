'use client';

import { useState } from 'react';
import { AlertTriangle, X, Phone, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);

  const handleWhatsApp = () => {
    const url = 'https://wa.me/1234567890?text=URGENT:%20I%20need%20help%20with%20a%20detained%20shipment';
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  const handleBookCall = () => {
    const url = 'https://calendly.com';
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 animate-pulse hover:animate-none"
      >
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-bold">EMERGENCY: STOP FEES</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Emergency Cargo Assistance
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Demurrage fees accumulate fast. Get immediate help from our compliance experts.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp: Instant Response
                <span className="ml-2 text-xs opacity-75">~2 min reply</span>
              </Button>

              <Button
                onClick={handleBookCall}
                variant="outline"
                className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 py-6"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Emergency Call
                <span className="ml-2 text-xs opacity-75">Next 30 mins</span>
              </Button>

              <Button
                variant="outline"
                className="w-full border-slate-300 dark:border-zinc-700 py-6"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Hotline: 1-800-IMPORT
                <span className="ml-2 text-xs opacity-75">24/7</span>
              </Button>
            </div>

            <div className="mt-6 rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
                <strong>Average demurrage fees:</strong> $150-500/day per container. 
                Every hour counts.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
