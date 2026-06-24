import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(2);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && !isScanning && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight">Ton canal VIP est-il une passoire ?</h1>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Les membres partagent tes signaux gratuitement. Découvre en 3 clics ton score de sécurité et bloque les voleurs instantanément.
              </p>
              
              <button
                onClick={startScan}
                className="w-full relative group bg-white text-black font-semibold rounded-xl p-4 flex items-center justify-center gap-2 overflow-hidden transition-all hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <Zap className="w-5 h-5" />
                Lancer le Diagnostic
              </button>
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                <Shield className="absolute inset-0 m-auto w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-medium text-neutral-300">Analyse des vulnérabilités...</h2>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-400">Score critique : 24/100</h2>
                    <p className="text-red-400/80 text-sm">Fuite de revenus détectée</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-neutral-300 bg-black/20 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Captures d'écran autorisées
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300 bg-black/20 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Transfert de messages possible
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300 bg-black/20 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Membres inactifs non expulsés
                  </div>
                </div>

                <div className="border-t border-red-500/20 pt-6">
                  <p className="text-sm text-red-400/80 mb-2">Perte estimée</p>
                  <p className="text-3xl font-bold text-white">-1 250 € <span className="text-lg text-neutral-500 font-normal">/ mois</span></p>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold">Le Gardien VIP</h3>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                    Blocage automatique des captures d'écran et transferts.
                  </li>
                  <li className="flex gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                    Kick instantané des abonnements Stripe expirés/impayés.
                  </li>
                </ul>

                <div className="flex items-end justify-between mb-8 pb-8 border-b border-neutral-800">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Abonnement</p>
                    <p className="text-4xl font-bold">49€<span className="text-lg text-neutral-500 font-normal">/mois</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md">Rentabilisé au 1er vol évité</p>
                  </div>
                </div>

                <a 
                  href="https://buy.stripe.com/28EfZgch01Ku2z6fZi18c0g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl p-4 flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  Protéger mon canal avec Stripe
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
