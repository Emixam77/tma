import { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Zap, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Sparkles,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    isVulnerable: boolean;
    explanation: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Comment vends-tu l'accès à ton canal VIP ?",
    options: [
      {
        text: "Via une passerelle de paiement passive (InviteMember, Whop, LaunchPass...)",
        isVulnerable: true,
        explanation: "Ces outils sont des passerelles de paiement passives. Ils vérifient la carte bancaire mais ne protègent pas le contenu. Un pirate peut cloner 100% de tes signaux vers un canal gratuit en moins de 2 secondes."
      },
      {
        text: "Manuellement ou via une autre méthode non automatisée",
        isVulnerable: true,
        explanation: "La gestion manuelle présente un risque d'erreur humaine élevé : retard d'expulsion des membres expirés, manque de suivi en temps réel et pertes financières directes."
      }
    ]
  },
  {
    id: 2,
    text: "Tes membres peuvent-ils copier ou transférer tes signaux et tes messages ?",
    options: [
      {
        text: "Oui, le transfert et la copie sont possibles",
        isVulnerable: true,
        explanation: "N'importe quel membre (ou un robot de clonage automatisé) peut transférer tes messages en temps réel à des milliers de personnes sur d'autres canaux."
      },
      {
        text: "Non, j'ai désactivé le transfert et la copie",
        isVulnerable: false,
        explanation: "C'est une bonne première étape. Cependant, cela ne bloque pas les captures d'écran, les enregistrements vidéo ou les robots de clonage avancés."
      }
    ]
  },
  {
    id: 3,
    text: "Les captures d'écran et les enregistrements vidéo sont-ils possibles dans ton canal ?",
    options: [
      {
        text: "Oui, tout le monde peut prendre des captures ou filmer l'écran",
        isVulnerable: true,
        explanation: "Tes signaux exclusifs, graphiques et formations privées peuvent être photographiés, archivés et partagés sous forme d'images en dehors de ton canal."
      },
      {
        text: "Non, c'est techniquement bloqué",
        isVulnerable: false,
        explanation: "Excellent. Tes membres ne peuvent pas sauvegarder de copie visuelle directe de ton contenu via l'application Telegram."
      }
    ]
  },
  {
    id: 4,
    text: "Que se passe-t-il si un membre arrête de payer son abonnement (Stripe/PayPal) ?",
    options: [
      {
        text: "L'expulsion est manuelle ou il y a un délai de traitement",
        isVulnerable: true,
        explanation: "Chaque jour de retard permet à des membres inactifs de continuer à profiter gratuitement de ton travail et de faire fuiter tes signaux payants."
      },
      {
        text: "Le membre est expulsé instantanément à la seconde près",
        isVulnerable: false,
        explanation: "C'est la règle d'or pour éviter le manque à gagner et décourager les profiteurs."
      }
    ]
  }
];

function App() {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'score' | 'solution'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // indices of selected options

  // Récupération de l'ID utilisateur Telegram via le SDK WebApp
  const tgUserId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const baseStripeUrl = "https://buy.stripe.com/28EfZgch01Ku2z6fZi18c0g";
  const checkoutUrl = tgUserId ? `${baseStripeUrl}?client_reference_id=${tgUserId}` : baseStripeUrl;

  const handleStart = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setStep('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('score');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      setStep('welcome');
    }
  };

  // Process answers
  const vulnerabilities = QUESTIONS.map((q, idx) => {
    const selectedOptionIdx = answers[idx];
    if (selectedOptionIdx === undefined) return null;
    const option = q.options[selectedOptionIdx];
    return {
      questionText: q.text,
      isVulnerable: option.isVulnerable,
      explanation: option.explanation,
      selectedText: option.text
    };
  }).filter(Boolean) as { questionText: string; isVulnerable: boolean; explanation: string; selectedText: string }[];

  const vulnerableCount = vulnerabilities.filter(v => v.isVulnerable).length;
  const score = Math.max(0, 100 - vulnerableCount * 25);

  let scoreColor = "text-red-500 border-red-500/20 bg-red-500/10";
  let scoreVerdict = "Passoire Totale";
  let scoreDesc = "Ton canal VIP est grand ouvert au vol de contenu et au clonage automatique.";

  if (score === 100) {
    scoreColor = "text-green-400 border-green-500/20 bg-green-500/10";
    scoreVerdict = "Parfaitement Sécurisé";
    scoreDesc = "Ton canal VIP dispose des meilleures barrières de protection actuelles.";
  } else if (score >= 75) {
    scoreColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    scoreVerdict = "Sécurité Modérée";
    scoreDesc = "Quelques failles subsistent et peuvent être exploitées par des membres malveillants.";
  } else if (score >= 50) {
    scoreColor = "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    scoreVerdict = "Sécurité Faible";
    scoreDesc = "Plusieurs failles majeures facilitent la fuite et la revente de tes signaux.";
  } else if (score >= 25) {
    scoreColor = "text-orange-500 border-orange-500/20 bg-orange-500/10";
    scoreVerdict = "Sécurité Critique";
    scoreDesc = "Ton contenu est hautement vulnérable au clonage en temps réel.";
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden flex items-center justify-center p-4">
      {/* Background glow effect */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Welcome Screen */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">
                Ton canal VIP est-il une passoire ?
              </h1>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Les membres partagent peut-être tes signaux gratuitement. Découvre tes failles de sécurité en 4 questions rapides et sécurise ton canal instantanément.
              </p>
              
              <button
                onClick={handleStart}
                className="w-full relative group bg-white text-black font-semibold rounded-xl p-4 flex items-center justify-center gap-2 overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <Zap className="w-5 h-5 fill-current" />
                Démarrer le Diagnostic
              </button>
            </motion.div>
          )}

          {/* STEP 2: Quiz Questions */}
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              {/* Header with back button & progress */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-full">
                  Question {currentQuestionIndex + 1} / {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Text */}
              <h2 className="text-xl font-bold tracking-tight leading-snug">
                {QUESTIONS[currentQuestionIndex].text}
              </h2>

              {/* Options Buttons */}
              <div className="space-y-3 pt-2">
                {QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-left bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 hover:bg-purple-950/10 rounded-2xl p-4 transition-all duration-200 group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center text-xs shrink-0 group-hover:border-purple-500 font-semibold bg-neutral-950 group-hover:bg-purple-950/20">
                      {idx === 0 ? 'A' : 'B'}
                    </div>
                    <span className="text-sm font-medium text-neutral-200 group-hover:text-white leading-relaxed">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Score & Verdict */}
          {step === 'score' && (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score summary panel */}
              <div className={`border rounded-3xl p-8 shadow-2xl relative overflow-hidden ${scoreColor}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-current shrink-0">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{score} / 100</h3>
                    <p className="font-bold text-sm uppercase tracking-wider opacity-90">{scoreVerdict}</p>
                  </div>
                </div>

                <p className="text-white/95 text-sm leading-relaxed mb-6">
                  {scoreDesc}
                </p>

                {/* Simulated Financial Leakage */}
                {score < 100 && (
                  <div className="bg-black/35 rounded-2xl p-4 flex items-center gap-4">
                    <TrendingDown className="w-8 h-8 text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">Fuite financière estimée</p>
                      <p className="text-lg font-bold text-white leading-tight">
                        Jusqu'à <span className="text-red-400">30%</span> de tes abonnés
                      </p>
                      <p className="text-xs text-neutral-400">partagent tes signaux gratuitement.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* List of identified failures */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 space-y-6">
                <h4 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Détail de tes failles de sécurité
                </h4>

                <div className="space-y-4">
                  {vulnerabilities.map((v, idx) => (
                    <div 
                      key={idx} 
                      className="bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-4 flex items-start gap-3"
                    >
                      {v.isVulnerable ? (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-neutral-400">{v.questionText}</p>
                        <p className="text-sm text-neutral-200 font-medium italic">« {v.selectedText} »</p>
                        <p className="text-xs text-neutral-400 leading-relaxed pt-1 border-t border-neutral-800/50 mt-1">
                          {v.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button to Solution screen */}
                <button
                  onClick={() => setStep('solution')}
                  className="w-full bg-white text-black font-bold rounded-xl p-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Découvrir la Solution
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleStart}
                  className="w-full text-xs text-neutral-500 hover:text-neutral-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refaire le diagnostic
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Solution, Comparison, Guarantee & Payment */}
          {step === 'solution' && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pb-8"
            >
              {/* Product Intro */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Le Gardien VIP</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Le Gardien VIP n'est pas une simple passerelle de paiement passive. C'est un système de sécurité active automatisé pour ton canal Telegram.
                </p>

                {/* Key educational point (Telegram feature) */}
                <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Technologie Sécurité Native
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Via l'API Telegram, le bot active nativement le paramètre <code className="bg-neutral-900 px-1 py-0.5 rounded text-purple-400 font-mono text-[10px]">has_protected_content = true</code> sur ton canal. 
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Cela bloque instantanément et techniquement les captures d'écran, les enregistrements vidéo et les transferts de messages pour tous les membres.
                  </p>
                </div>
              </div>

              {/* Competitive Matchup */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 space-y-6">
                <h4 className="text-lg font-bold tracking-tight">Le Match Concurrentiel</h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Competitors */}
                  <div className="bg-neutral-950/40 border border-neutral-800 rounded-2xl p-4 space-y-3">
                    <p className="font-bold text-red-400 border-b border-neutral-800 pb-2">InviteMember / Whop</p>
                    <ul className="space-y-2 text-neutral-400">
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        Passerelles de paiement passives
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        Ne bloquent aucun vol ou copie
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        Commissions sur ventes possibles
                      </li>
                    </ul>
                  </div>

                  {/* Le Gardien VIP */}
                  <div className="bg-purple-950/10 border border-purple-500/30 rounded-2xl p-4 space-y-3">
                    <p className="font-bold text-purple-400 border-b border-purple-950 pb-2">Le Gardien VIP</p>
                    <ul className="space-y-2 text-neutral-300">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        Sécurité active & automatisée
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        Bloque screens, transferts et bots
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        0% commission (prix fixe)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 14-Day Anti-Leak Guarantee */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 relative overflow-hidden">
                {/* Visual effect */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                    <Shield className="w-5 h-5 fill-current" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">La Garantie Anti-Fuite 14 Jours</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Configure le bot sur ton canal. Si un membre réussit à transférer un seul de tes messages ou à faire une capture d'écran dans les 14 jours, on te rembourse l'abonnement et on t'offre 6 mois d'utilisation gratuite.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing & Checkout */}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-end justify-between pb-6 border-b border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Abonnement Standard</p>
                    <p className="text-4xl font-extrabold tracking-tight">49€<span className="text-base text-neutral-500 font-normal"> / mois</span></p>
                    <p className="text-[10px] text-purple-400 font-semibold mt-1">Sans commission sur tes ventes</p>
                  </div>
                  <div className="text-right max-w-[150px]">
                    <p className="text-[10px] text-neutral-400 italic">
                      "Le prix d'un seul abonné VIP. Si le système bloque un seul pirate, ton abonnement est rentabilisé pour l'année."
                    </p>
                  </div>
                </div>

                <a 
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl p-4 flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer text-sm"
                >
                  Protéger mon canal avec Stripe
                  <ArrowRight className="w-4.5 h-4.5" />
                </a>

                {/* Back to Score */}
                <button
                  onClick={() => setStep('score')}
                  className="w-full text-xs text-neutral-500 hover:text-neutral-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voir mes failles de sécurité
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
