
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Stats, Job, LogEntry, Relationship, Property, Company, Loan } from './types';
import { GeminiService } from './services/geminiService';

const INITIAL_STATS: Stats = {
  health: 100,
  happiness: 80,
  smarts: 30,
  looks: 60,
  stress: 10,
  money: 50000
};

const COMPANIES: Company[] = [
  { id: '1', name: "Orange-CI", industry: "Telecom", prestige: 85 },
  { id: '2', name: "SOTRA", industry: "Transport", prestige: 40 },
  { id: '3', name: "CIE", industry: "Énergie", prestige: 75 },
  { id: '4', name: "Maquis 'Le Défi'", industry: "Restauration", prestige: 20 },
  { id: '5', name: "BNI", industry: "Banque", prestige: 90 },
  { id: '6', name: "Start-up 'Babi Tech'", industry: "Technologie", prestige: 65 },
  { id: '7', name: "Éducation Nationale", industry: "Secteur Public", prestige: 55 },
  { id: '8', name: "Studio Graphik-Babi", industry: "Design", prestige: 70 },
  { id: '9', name: "Sécurité 'Vigilance'", industry: "Services", prestige: 30 }
];

const JOBS: Job[] = [
  { company: COMPANIES[3], title: "Gérant de Maquis", salary: 85000, stressLevel: 45, requirement: 10, workingHours: "17h - 02h" },
  { company: COMPANIES[1], title: "Laveur de Bus", salary: 55000, stressLevel: 65, requirement: 5, workingHours: "05h - 14h" },
  { company: COMPANIES[0], title: "Conseiller Client", salary: 280000, stressLevel: 55, requirement: 45, workingHours: "08h - 17h" },
  { company: COMPANIES[4], title: "Analyste Junior", salary: 650000, stressLevel: 75, requirement: 85, workingHours: "08h - 19h" },
  { company: COMPANIES[5], title: "Développeur Web", salary: 450000, stressLevel: 60, requirement: 70, workingHours: "09h - 18h" },
  { company: COMPANIES[7], title: "Infographiste Créatif", salary: 350000, stressLevel: 50, requirement: 55, workingHours: "09h - 17h" },
  { company: COMPANIES[6], title: "Professeur de Lycée", salary: 320000, stressLevel: 50, requirement: 60, workingHours: "07h - 16h" },
  { company: COMPANIES[1], title: "Chauffeur de Gbaka", salary: 120000, stressLevel: 85, requirement: 15, workingHours: "04h - 22h" },
  { company: COMPANIES[8], title: "Agent de Sécurité", salary: 110000, stressLevel: 40, requirement: 10, workingHours: "19h - 07h" },
  { company: COMPANIES[5], title: "Data Scientist", salary: 850000, stressLevel: 65, requirement: 95, workingHours: "08h - 18h" }
];

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    isRegistered: false,
    timer: 180,
    player: {
      name: "",
      age: 18,
      month: 0,
      job: null,
      stats: INITIAL_STATS,
      relations: [
        { id: '1', name: 'Vieux Père Koffi', type: 'Ami', level: 75 },
        { id: '2', name: 'Maman Brigitte', type: 'Famille', level: 95 }
      ],
      assets: { properties: [], vehicles: [] },
      loans: [],
      education: "Baccalauréat",
      logs: []
    }
  });

  const [activeTab, setActiveTab] = useState<'vie' | 'travail' | 'social' | 'patrimoine' | 'activites'>('vie');
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const gemini = new GeminiService();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.player.logs]);

  useEffect(() => {
    if (!gameState.isRegistered || showSplash) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timer: Math.max(0, prev.timer - 1)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isRegistered, showSplash]);

  useEffect(() => {
    if (loading || currentEvent) return;

    if (gameState.timer === 120 || gameState.timer === 60) {
      triggerRandomChallenge();
    } else if (gameState.timer === 0) {
      setGameState(prev => ({ ...prev, timer: 180 }));
      handleNextStep();
    }
  }, [gameState.timer, loading, currentEvent]);

  const triggerRandomChallenge = async () => {
    if (currentEvent || loading) return;
    setLoading(true);

    const type = (gameState.player.job && Math.random() > 0.5) ? 'job_challenge' : 'random_event';
    const extra = type === 'job_challenge'
      ? `Challenge imprévu au poste de ${gameState.player.job?.title}. Un problème à régler immédiatement.`
      : "Événement imprévu dans les rues d'Abidjan (ex: renverser une table au maquis par accident, rencontre inattendue, petit problème de transport, une galère nouchi).";

    const event = await gemini.generateNarrative(gameState, type as any, extra);
    if (event) setCurrentEvent(event);
    setLoading(false);
  };

  const addLog = (text: string, type: LogEntry['type'] = 'neutral') => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        logs: [...prev.player.logs, { 
          id: Date.now().toString(), 
          year: prev.player.age, 
          month: prev.player.month, 
          text, 
          type 
        }]
      }
    }));
  };

  const updateStats = (diff: Partial<Stats>) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: {
          health: Math.max(0, Math.min(100, prev.player.stats.health + (diff.health || 0))),
          happiness: Math.max(0, Math.min(100, prev.player.stats.happiness + (diff.happiness || 0))),
          smarts: Math.max(0, Math.min(100, prev.player.stats.smarts + (diff.smarts || 0))),
          looks: Math.max(0, Math.min(100, prev.player.stats.looks + (diff.looks || 0))),
          stress: Math.max(0, Math.min(100, prev.player.stats.stress + (diff.stress || 0))),
          money: prev.player.stats.money + (diff.money || 0)
        }
      }
    }));
  };

  const handleNextStep = async () => {
    setLoading(true);
    const nextMonthIndex = (gameState.player.month + 1) % 12;
    const nextAge = nextMonthIndex === 0 ? gameState.player.age + 1 : gameState.player.age;
    
    const totalMonthlyLoanPayment = gameState.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    const hasActiveLoans = gameState.player.loans.length > 0;
    
    let eventType: any = 'yearly';
    if (hasActiveLoans && Math.random() > 0.7) {
      eventType = 'debt_event';
    } else if (gameState.player.job && Math.random() > 0.5) {
      eventType = 'job_challenge';
    }
    
    const event = await gemini.generateNarrative(gameState, eventType, 
      gameState.player.job ? `Challenge lié au poste de ${gameState.player.job.title}.` : "Mois tranquille à Babi."
    );
    
    setGameState(prev => {
      const monthlySalary = prev.player.job?.salary || 0;
      const updatedLoans = prev.player.loans.map(l => ({
        ...l,
        monthsRemaining: l.monthsRemaining - 1,
        remainingAmount: l.remainingAmount - l.monthlyPayment
      })).filter(l => l.monthsRemaining > 0);

      const netIncome = monthlySalary - totalMonthlyLoanPayment;

      return {
        ...prev,
        player: {
          ...prev.player,
          age: nextAge,
          month: nextMonthIndex,
          loans: updatedLoans,
          stats: {
            ...prev.player.stats,
            money: prev.player.stats.money + netIncome,
            health: prev.player.stats.health - (prev.player.age > 40 && nextMonthIndex === 0 ? 3 : 0),
            stress: Math.max(0, prev.player.stats.stress + (prev.player.job ? 2 : 0) + (hasActiveLoans ? 5 : -5))
          }
        }
      };
    });

    if (gameState.player.job) {
      addLog(`💰 VIREMENT REÇU : +${gameState.player.job.salary.toLocaleString()} FCFA (Salaire ${MONTHS[gameState.player.month]})`, 'positive');
    }
    
    if (totalMonthlyLoanPayment > 0) {
      addLog(`📉 PRÉLÈVEMENT BANCAIRE : -${totalMonthlyLoanPayment.toLocaleString()} FCFA (Remboursement prêt)`, 'negative');
    }

    if (event) setCurrentEvent(event);
    setLoading(false);
  };

  const takeLoan = (amount: number, duration: number) => {
    const interestRate = 0.15;
    const totalToRepay = amount * (1 + interestRate);
    const monthlyPayment = Math.round(totalToRepay / duration);
    
    const newLoan: Loan = {
      id: Date.now().toString(),
      amount,
      remainingAmount: totalToRepay,
      monthlyPayment,
      interestRate,
      durationMonths: duration,
      monthsRemaining: duration
    };

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        money: prev.player.stats.money + amount,
        stats: { ...prev.player.stats, money: prev.player.stats.money + amount, stress: prev.player.stats.stress + 10 },
        loans: [...prev.player.loans, newLoan]
      }
    }));

    addLog(`🏦 PRÊT ACCORDÉ : Tu as reçu ${amount.toLocaleString()} FCFA. Remboursement: ${monthlyPayment.toLocaleString()} FCFA/mois.`, 'positive');
  };

  const applyForJob = async (job: Job) => {
    if (gameState.player.stats.smarts < job.requirement) {
      addLog(`❌ Dossier rejeté : Niveau d'intelligence insuffisant.`, 'negative');
      return;
    }
    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'interview', `Poste: ${job.title} chez ${job.company.name}. Salaire: ${job.salary} FCFA.`);
    if (event) {
      const updatedChoices = event.choices.map((c: any) => ({
        ...c,
        jobToApply: job
      }));
      setCurrentEvent({ ...event, choices: updatedChoices });
    }
    setLoading(false);
  };

  const handleChoice = (choice: any) => {
    updateStats(choice.effect);
    if (choice.actionType === 'HIRE' && choice.jobToApply) {
      setGameState(prev => ({ ...prev, player: { ...prev.player, job: choice.jobToApply }}));
      addLog(`✅ EMBAUCHÉ : Tu es ${choice.jobToApply.title} !`, 'positive');
      setActiveTab('vie');
    } else if (choice.actionType === 'FAIL') {
      addLog(`❌ ENTRETIEN ÉCHOUÉ.`, 'negative');
    }
    
    addLog(choice.resultLog || choice.text, (choice.effect.happiness || 0) < 0 || (choice.effect.health || 0) < 0 ? 'negative' : 'positive');
    setCurrentEvent(null);
  };

  const quitJob = () => {
    if (window.confirm("Tu es sûr ?")) {
      setGameState(prev => ({ ...prev, player: { ...prev.player, job: null }}));
      addLog("Tu as démissionné.", 'neutral');
    }
  };

  const interactWithKoffi = async (action: 'conseil' | 'biere' | 'business') => {
    setLoading(true);
    const contexts = {
      conseil: "Le joueur demande un conseil de vie au Vieux Père Koffi.",
      biere: "Le joueur propose de payer une bière au maquis à Koffi.",
      business: "Le joueur demande des tuyaux sur les affaires à Abidjan."
    };
    const event = await gemini.generateNarrative(gameState, 'social_npc', `NPC:Vieux Père Koffi. Action: ${contexts[action]}`);
    if (event) setCurrentEvent(event);
    setLoading(false);
  };

  const goToMall = async () => {
    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'shopping', "Le joueur entre dans un centre commercial chic pour faire des achats de vêtements ou d'électronique.");
    if (event) setCurrentEvent(event);
    setLoading(false);
  };

  if (showSplash) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="flex flex-col items-center animate-in zoom-in duration-1000">
          <div className="w-24 h-24 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 -rotate-6 border-4 border-white/20">
            <i className="fa-solid fa-crown text-5xl text-white"></i>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-lg">Abidjan</h1>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-orange-500 italic mb-2">Life</h2>
          <div className="h-1 w-32 bg-orange-500/30 rounded-full mt-4">
            <div className="h-full bg-orange-500 rounded-full animate-[loading_3s_ease-in-out]"></div>
          </div>
        </div>
        <div className="absolute bottom-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-2">Powered by AI</p>
          <p className="text-sm font-black uppercase tracking-widest text-white">
            Developed by <span className="text-orange-500">Alain Charles OFFI</span>
          </p>
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-orange-500">Nouvelle Vie</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Bienvenue au Pays des Éléphants</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setGameState(p => ({ ...p, isRegistered: true })); setShowRegister(false); addLog("Nouvelle aventure à Babi !", "positive"); }} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ton Nom (Le Blaze)</label>
            <input required className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl focus:border-orange-600 outline-none font-bold text-lg text-white" value={gameState.player.name} onChange={e => setGameState(p => ({ ...p, player: { ...p.player, name: e.target.value }}))} placeholder="Djo l'Américain" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Âge</label>
               <input type="number" min="18" max="30" className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl focus:border-orange-600 outline-none font-bold text-white" value={gameState.player.age} onChange={e => setGameState(p => ({ ...p, player: { ...p.player, age: parseInt(e.target.value) }}))} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Éducation</label>
               <select className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl focus:border-orange-600 outline-none font-bold text-sm text-white" value={gameState.player.education} onChange={e => setGameState(p => ({ ...p, player: { ...p.player, education: e.target.value }}))}>
                 <option>Baccalauréat</option>
                 <option>BTS</option>
                 <option>Master</option>
               </select>
             </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-5 rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-900/20 active:scale-95 text-white">
            Démarrer ma vie
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto overflow-hidden shadow-2xl relative">
      <div className="h-1.5 w-full bg-slate-900 overflow-hidden shrink-0 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-1000 ease-linear"
          style={{ width: `${(gameState.timer / 180) * 100}%` }}
        />
      </div>
      <header className="bg-slate-950 p-6 shadow-2xl z-30 border-b border-slate-800 shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">{gameState.player.name}</h2>
            <div className="flex items-center gap-2">
              <span className="bg-orange-600 text-[9px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider">{gameState.player.age} ANS</span>
              <span className="bg-blue-600 text-[9px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider">{MONTHS[gameState.player.month].toUpperCase()}</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[150px]">
                {gameState.player.job ? `${gameState.player.job.title} @ ${gameState.player.job.company.name}` : "Sans emploi stable"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-500 leading-none">{gameState.player.stats.money.toLocaleString()} <small className="text-[10px]">FCFA</small></p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Solde Actuel</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: 'Santé', val: gameState.player.stats.health, color: 'bg-rose-500', icon: 'fa-heart-pulse' },
            { label: 'Bonheur', val: gameState.player.stats.happiness, color: 'bg-amber-400', icon: 'fa-face-smile' },
            { label: 'Smarts', val: gameState.player.stats.smarts, color: 'bg-sky-500', icon: 'fa-brain' },
            { label: 'Looks', val: gameState.player.stats.looks, color: 'bg-fuchsia-500', icon: 'fa-person-rays' }
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-1"><i className={`fa-solid ${s.icon}`}></i> {s.label}</span>
                <span className="text-[9px] font-black text-white">{s.val}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} transition-all duration-700`} style={{ width: `${s.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 relative">
        {gameState.player.logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <i className="fa-solid fa-book-open text-6xl text-slate-300 mb-4"></i>
            <p className="text-xs font-bold uppercase text-slate-400">Journal d'Abidjan vide...</p>
          </div>
        )}
        {gameState.player.logs.map((log) => (
          <div key={log.id} className="animate-in slide-in-from-bottom duration-300">
             <div className={`p-4 rounded-2xl shadow-sm border-l-4 bg-white ${log.type === 'positive' ? 'border-emerald-500' : log.type === 'negative' ? 'border-rose-500' : 'border-slate-300'}`}>
                <div className="flex justify-between items-start mb-2">
                   <span className="bg-slate-100 text-[10px] font-black px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">{log.year} ANS - {MONTHS[log.month || 0]}</span>
                </div>
                <p className="text-slate-900 text-sm font-bold leading-relaxed">{log.text}</p>
             </div>
          </div>
        ))}
        <div ref={logEndRef} />

        {currentEvent && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end p-4">
            <div className="bg-white w-full rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
               <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
               <h3 className="text-orange-600 text-xs font-black uppercase tracking-[0.2em] mb-4">Alerte Babi</h3>
               <p className="text-slate-900 font-bold text-xl leading-snug mb-8 italic">"{currentEvent.description}"</p>
               <div className="space-y-3">
                  {currentEvent.choices.map((c: any, i: number) => (
                    <button key={i} onClick={() => handleChoice(c)} className="w-full text-left p-5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-100 rounded-2xl text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-4 active:scale-95">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${c.actionType === 'HIRE' ? 'fa-check' : 'fa-chevron-right'} text-[10px] text-orange-600`}></i>
                      </div>
                      {c.text}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t-2 border-slate-100 p-4 min-h-[180px] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Le temps défile à Babi...</p>
          </div>
        ) : (
          <div className="h-full">
            {activeTab === 'vie' && (
              <button
                onClick={() => {
                  handleNextStep();
                  setGameState(prev => ({ ...prev, timer: 180 }));
                }}
                className="w-full h-full bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-xl shadow-orange-600/20 flex flex-col items-center justify-center gap-2 p-6 transition-all active:scale-95 group"
              >
                <i className={`fa-solid ${gameState.player.job ? 'fa-briefcase' : 'fa-play'} text-3xl group-hover:scale-110 transition-transform`}></i>
                <div className="text-center">
                  <span className="block text-xs font-black uppercase tracking-widest opacity-80">Cycle Mensuel ({Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')})</span>
                  <span className="block text-2xl font-black italic">{gameState.player.job ? "TRAVAILLER (1 MOIS)" : "VIVRE LE MOIS"}</span>
                </div>
              </button>
            )}

            {activeTab === 'travail' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Marché de l'Emploi</h3>
                   {gameState.player.job && (
                     <button onClick={quitJob} className="text-[9px] font-black text-rose-500 uppercase border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-all active:scale-90">Démissionner</button>
                   )}
                </div>
                <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[140px] pr-1">
                  {gameState.player.job ? (
                    <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-3xl flex flex-col items-center text-center">
                       <i className="fa-solid fa-briefcase text-emerald-500 text-2xl mb-2"></i>
                       <p className="text-xs font-black text-emerald-900 uppercase">{gameState.player.job.title}</p>
                       <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">{gameState.player.job.salary.toLocaleString()} FCFA/mois</p>
                    </div>
                  ) : (
                    JOBS.map((j, i) => (
                      <button key={i} onClick={() => applyForJob(j)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 transition-all text-left border-slate-100 hover:border-blue-500 active:scale-95 group">
                         <div className="flex flex-col">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">{j.company.name}</p>
                           <p className="text-sm font-black text-slate-950">{j.title}</p>
                         </div>
                         <div className="text-right flex flex-col items-end">
                           <p className="text-xs font-black text-emerald-600">{j.salary.toLocaleString()} <small>FCFA</small></p>
                         </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
               <div className="space-y-4 overflow-y-auto max-h-[160px] pr-1">
                  <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Tes Relations</h3>
                  {gameState.player.relations.map(rel => (
                    <div key={rel.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col gap-3">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black uppercase">{rel.name[0]}</div>
                             <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rel.type}</p>
                               <p className="text-sm font-black text-slate-900">{rel.name}</p>
                             </div>
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-pink-500" style={{ width: `${rel.level}%` }} />
                          </div>
                       </div>
                       
                       {rel.name === 'Vieux Père Koffi' ? (
                         <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => interactWithKoffi('conseil')} className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-2 rounded-lg hover:bg-blue-100 transition-colors">Conseil de Sage</button>
                            <button onClick={() => interactWithKoffi('biere')} className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-2 rounded-lg hover:bg-amber-100 transition-colors">Payer sa Bière</button>
                            <button onClick={() => interactWithKoffi('business')} className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Parler Biz</button>
                         </div>
                       ) : (
                         <button onClick={async () => { setLoading(true); const ev = await gemini.generateNarrative(gameState, 'social', `Conversation avec ${rel.name}`); if(ev) setCurrentEvent(ev); setLoading(false); }} className="w-full text-[8px] font-black uppercase text-blue-600 bg-blue-50 py-2 rounded-lg active:bg-blue-100 transition-colors">Discuter</button>
                       )}
                    </div>
                  ))}
               </div>
            )}

            {activeTab === 'activites' && (
               <div className="grid grid-cols-3 gap-3">
                 <button onClick={goToMall} className="flex flex-col items-center justify-center p-4 bg-fuchsia-50 rounded-2xl border-2 border-fuchsia-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-bag-shopping text-fuchsia-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Shopping</span>
                    <span className="text-[8px] font-bold text-fuchsia-400 mt-1">+Looks</span>
                 </button>
                 <button onClick={async () => { setLoading(true); const ev = await gemini.generateNarrative(gameState, 'activity', "Le joueur s'instruit sérieusement."); if(ev) { const choices = ev.choices.map((c:any) => ({...c, effect: {...c.effect, smarts: (c.effect.smarts || 0) + 5}})); setCurrentEvent({...ev, choices}); } setLoading(false); }} className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-graduation-cap text-blue-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Études</span>
                 </button>
                 {[
                   { label: 'Maquis', icon: 'fa-beer-mug-empty', color: 'text-amber-500', ctx: 'Activity: Maquis' },
                   { label: 'Gym', icon: 'fa-dumbbell', color: 'text-rose-500', ctx: 'Activity: Gym' },
                   { label: 'Clinique', icon: 'fa-hospital', color: 'text-emerald-500', ctx: 'Activity: Hospital' },
                   { label: 'Église', icon: 'fa-hands-praying', color: 'text-indigo-500', ctx: 'Activity: Church' }
                 ].map(act => (
                   <button key={act.label} onClick={async () => { setLoading(true); const ev = await gemini.generateNarrative(gameState, 'activity', act.ctx); if(ev) setCurrentEvent(ev); setLoading(false); }} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 active:scale-95 transition-all">
                     <i className={`fa-solid ${act.icon} ${act.color} text-2xl mb-1`}></i>
                     <span className="text-[10px] font-black uppercase text-slate-900 text-center">{act.label}</span>
                   </button>
                 ))}
               </div>
            )}

            {activeTab === 'patrimoine' && (
              <div className="space-y-4">
                <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Gestion Financière (Banque)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => takeLoan(100000, 6)} className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-left hover:bg-emerald-100 transition-all">
                    <p className="text-[10px] font-black text-emerald-600 uppercase">Petit Prêt</p>
                    <p className="text-sm font-black text-slate-900">100.000 FCFA</p>
                  </button>
                  <button onClick={() => takeLoan(500000, 12)} className="p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl text-left hover:bg-blue-100 transition-all">
                    <p className="text-[10px] font-black text-blue-600 uppercase">Prêt Projet</p>
                    <p className="text-sm font-black text-slate-900">500.000 FCFA</p>
                  </button>
                </div>
                {gameState.player.loans.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-[8px] font-black uppercase text-slate-400">Prêts en cours</p>
                    {gameState.player.loans.map(l => (
                      <div key={l.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-600">{l.remainingAmount.toLocaleString()} FCFA restant</span>
                        <span className="text-[9px] font-black text-orange-600">{l.monthsRemaining} mois</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="bg-white border-t-2 border-slate-100 flex justify-around p-2 pb-8 safe-bottom z-40 shrink-0">
        {[
          { id: 'vie', icon: 'fa-newspaper', label: 'Journal' },
          { id: 'travail', icon: 'fa-briefcase', label: 'Carrière' },
          { id: 'social', icon: 'fa-user-group', label: 'Contacts' },
          { id: 'activites', icon: 'fa-map-location-dot', label: 'Sorties' },
          { id: 'patrimoine', icon: 'fa-money-bill-trend-up', label: 'Banque' }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === t.id ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className={`fa-solid ${t.icon} text-xl`}></i>
            <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
