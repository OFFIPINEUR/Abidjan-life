
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Stats, Job, LogEntry, Relationship, Property, Company, Loan, Business } from './types';
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

const NEIGHBORHOODS = [
  { name: "Yopougon", prestige: 30, basePrice: 2000000, rent: 50000 },
  { name: "Abobo", prestige: 20, basePrice: 1500000, rent: 35000 },
  { name: "Adjamé", prestige: 25, basePrice: 1800000, rent: 45000 },
  { name: "Koumassi", prestige: 35, basePrice: 2500000, rent: 60000 },
  { name: "Marcory", prestige: 70, basePrice: 15000000, rent: 250000 },
  { name: "Cocody", prestige: 85, basePrice: 25000000, rent: 400000 },
  { name: "Plateau", prestige: 90, basePrice: 35000000, rent: 550000 },
  { name: "Bassam", prestige: 60, basePrice: 10000000, rent: 150000 },
  { name: "Locodjoro", prestige: 40, basePrice: 3000000, rent: 70000 }
];

const FURNITURE_ITEMS = [
  { id: 'f1', name: "Matelas Orthopédique", price: 150000, healthBonus: 5, happinessBonus: 2 },
  { id: 'f2', name: "Canapé en Cuir", price: 450000, healthBonus: 0, happinessBonus: 8 },
  { id: 'f3', name: "Climatiseur Split", price: 250000, healthBonus: 2, happinessBonus: 10 },
  { id: 'f4', name: "Smart TV 65\"", price: 350000, healthBonus: 0, happinessBonus: 12 },
  { id: 'f5', name: "Cuisine Équipée", price: 1200000, healthBonus: 10, happinessBonus: 5 }
];

const GIFTS = [
  { id: 'g1', name: "Chocolats fins", price: 15000, levelBonus: 5 },
  { id: 'g2', name: "Parfum de luxe", price: 85000, levelBonus: 15 },
  { id: 'g3', name: "Montre en or", price: 250000, levelBonus: 30 },
  { id: 'g4', name: "Bouquet de fleurs", price: 10000, levelBonus: 3 }
];

const VEHICLES = [
  { id: 'v1', name: "Gbaka (Occasion)", price: 8000000, prestige: 10, isBusiness: true },
  { id: 'v2', name: "Toyota Corolla", price: 12000000, prestige: 40, isBusiness: false },
  { id: 'v3', name: "Range Rover", price: 65000000, prestige: 95, isBusiness: false },
  { id: 'v4', name: "Sotra (Mini bus)", price: 15000000, prestige: 20, isBusiness: true }
];

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
      logs: [],
      inventory: [],
      businesses: []
    }
  });

  const [activeTab, setActiveTab] = useState<'vie' | 'travail' | 'social' | 'patrimoine' | 'activites' | 'boutique' | 'smartphone' | 'smartphone_app'>('vie');
  const [selectedApp, setSelectedApp] = useState<'bank' | 'business' | 'dating' | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
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

  const buyFurniture = (furniture: any, propertyId: string) => {
    if (gameState.player.stats.money < furniture.price) {
      addLog("Pas assez d'argent pour ce meuble !", "negative");
      return;
    }
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: { ...prev.player.stats, money: prev.player.stats.money - furniture.price },
        assets: {
          ...prev.player.assets,
          properties: prev.player.assets.properties.map(p =>
            p.id === propertyId ? { ...p, furnishings: [...p.furnishings, { ...furniture }] } : p
          )
        }
      }
    }));
    addLog(`🛋️ ACHAT : ${furniture.name} ajouté à ta maison.`, "positive");
  };

  const buyVehicle = (vehicle: any) => {
    if (gameState.player.stats.money < vehicle.price) {
      addLog("Pas assez d'argent pour ce véhicule !", "negative");
      return;
    }
    setGameState(prev => {
      const newBusinesses = [...prev.player.businesses];
      if (vehicle.isBusiness) {
        newBusinesses.push({
          id: Date.now().toString(),
          name: `Business ${vehicle.name}`,
          type: 'Gbaka',
          investment: vehicle.price,
          monthlyRevenue: Math.round(vehicle.price * 0.05) // 5% de rendement mensuel
        });
      }
      return {
        ...prev,
        player: {
          ...prev.player,
          stats: { ...prev.player.stats, money: prev.player.stats.money - vehicle.price, looks: prev.player.stats.looks + Math.round(vehicle.prestige/5) },
          assets: {
            ...prev.player.assets,
            vehicles: [...prev.player.assets.vehicles, { ...vehicle }]
          },
          businesses: newBusinesses
        }
      };
    });
    addLog(`🚗 ACHAT : ${vehicle.name} acquis ! ${vehicle.isBusiness ? 'Le business tourne déjà.' : ''}`, "positive");
  };

  const buyHouse = (neighborhood: any, type: 'RENT' | 'OWN') => {
    const price = type === 'OWN' ? neighborhood.basePrice : neighborhood.rent;
    if (gameState.player.stats.money < price) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }
    const newProperty: Property = {
      id: Date.now().toString(),
      name: `Maison à ${neighborhood.name}`,
      location: neighborhood.name,
      type: type,
      price: type === 'OWN' ? price : 0,
      monthlyCost: type === 'RENT' ? price : 5000, // Charges minimes si proprio
      furnishings: []
    };
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: { ...prev.player.stats, money: prev.player.stats.money - price, happiness: prev.player.stats.happiness + 20 },
        assets: {
          ...prev.player.assets,
          properties: [...prev.player.assets.properties, newProperty]
        }
      }
    }));
    addLog(`🏠 LOGEMENT : Tu as emménagé à ${neighborhood.name} (${type === 'OWN' ? 'Propriétaire' : 'Locataire'}).`, "positive");
  };

  const launchBusiness = (type: 'Boutique' | 'Maquis' | 'Transport') => {
    const costs = { 'Boutique': 500000, 'Maquis': 1000000, 'Transport': 2000000 };
    const cost = costs[type];

    if (gameState.player.stats.money < cost) {
      addLog(`Pas assez d'argent pour lancer ce business (${cost.toLocaleString()} FCFA nécessaires)`, "negative");
      return;
    }

    const newBusiness: Business = {
      id: Date.now().toString(),
      name: `${type} de ${gameState.player.name.split(' ')[0]}`,
      type: type,
      investment: cost,
      monthlyRevenue: Math.round(cost * 0.08) // 8% de rendement mensuel
    };

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: { ...prev.player.stats, money: prev.player.stats.money - cost, stress: prev.player.stats.stress + 15 },
        businesses: [...prev.player.businesses, newBusiness]
      }
    }));
    addLog(`🚀 BUSINESS : Tu as lancé ton propre business de ${type} !`, "positive");
  };

  const buyItem = (item: any) => {
    if (gameState.player.stats.money < item.price) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: { ...prev.player.stats, money: prev.player.stats.money - item.price },
        inventory: [...prev.player.inventory, { id: Date.now().toString(), name: item.name, type: item.type, value: item.price }]
      }
    }));
    addLog(`🛒 ACHAT : ${item.name} ajouté à ton inventaire.`, "positive");
  };

  const socialInteract = async (relId: string, action: 'chat' | 'flirt' | 'gift' | 'marry' | 'cohabit' | 'child') => {
    const relation = gameState.player.relations.find(r => r.id === relId);
    if (!relation) return;

    setLoading(true);
    let extra = `Action: ${action} avec ${relation.name} (${relation.type}).`;

    if (action === 'gift') {
      const gift = gameState.player.inventory.find(i => i.type === 'Gift');
      if (!gift) {
        addLog("Tu n'as pas de cadeau à offrir ! Va en acheter à la boutique.", "negative");
        setLoading(false);
        return;
      }
      extra += ` Cadeau offert: ${gift.name}.`;
      // Update level and remove gift
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          relations: prev.player.relations.map(r => r.id === relId ? { ...r, level: Math.min(100, r.level + 15) } : r),
          inventory: prev.player.inventory.filter(i => i.id !== gift.id)
        }
      }));
    }

    const event = await gemini.generateNarrative(gameState, action === 'flirt' || action === 'marry' ? 'dating' : 'social', extra);
    if (event) {
      // Add specialized choices for marriage/cohabit
      if (action === 'marry') {
        event.choices = event.choices.map((c: any) => ({
          ...c,
          actionType: c.text.toLowerCase().includes('oui') ? 'MARRY' : 'FAIL',
          partnerId: relId
        }));
      } else if (action === 'cohabit') {
         event.choices = event.choices.map((c: any) => ({
          ...c,
          actionType: c.text.toLowerCase().includes('oui') ? 'COHABIT' : 'FAIL',
          partnerId: relId
        }));
      } else if (action === 'child') {
         event.choices = event.choices.map((c: any) => ({
          ...c,
          actionType: c.text.toLowerCase().includes('oui') ? 'CHILD' : 'FAIL',
          partnerId: relId
        }));
      }
      setCurrentEvent(event);
    }
    setLoading(false);
  };

  const findNewRelation = async () => {
    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'dating', "Le joueur cherche à faire de nouvelles connaissances à Abidjan.");
    if (event) {
      event.choices = event.choices.map((c: any) => ({
        ...c,
        actionType: 'NEW_RELATION'
      }));
      setCurrentEvent(event);
    }
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
    
    const businessIncome = gameState.player.businesses.reduce((acc, b) => acc + b.monthlyRevenue, 0);
    const childrenCount = gameState.player.relations.filter(r => r.type === 'Enfant').length;
    const childExpenses = childrenCount * 30000;
    const livingWithPartner = gameState.player.relations.some(r => r.livingTogether);
    const rentExpenses = gameState.player.assets.properties.filter(p => p.type === 'RENT').reduce((acc, p) => acc + p.monthlyCost, 0);

    // Partage des frais si on vit ensemble (loyer divisé par 2 si partenaire travaille ?)
    // Pour simplifier, on réduit un peu le loyer si on vit ensemble
    const finalRentExpenses = livingWithPartner ? rentExpenses * 0.7 : rentExpenses;

    let eventType: any = 'yearly';
    if (hasActiveLoans && Math.random() > 0.8) {
      eventType = 'debt_event';
    } else if (gameState.player.businesses.length > 0 && Math.random() > 0.7) {
      eventType = 'business_event';
    } else if (childrenCount > 0 && Math.random() > 0.7) {
      eventType = 'child_event';
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

      const netIncome = monthlySalary + businessIncome - totalMonthlyLoanPayment - childExpenses - finalRentExpenses;

      // Bonus santé/bonheur des meubles
      const healthBonus = prev.player.assets.properties.reduce((acc, p) => acc + p.furnishings.reduce((fAcc, f) => fAcc + f.healthBonus, 0), 0) / 10;
      const happyBonus = prev.player.assets.properties.reduce((acc, p) => acc + p.furnishings.reduce((fAcc, f) => fAcc + f.happinessBonus, 0), 0) / 10;

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
            health: Math.min(100, prev.player.stats.health + healthBonus - (prev.player.age > 40 && nextMonthIndex === 0 ? 3 : 0)),
            happiness: Math.min(100, prev.player.stats.happiness + happyBonus),
            stress: Math.max(0, prev.player.stats.stress + (prev.player.job ? 2 : 0) + (hasActiveLoans ? 5 : -5) + (childrenCount * 2))
          }
        }
      };
    });

    if (gameState.player.job) {
      addLog(`💰 VIREMENT REÇU : +${gameState.player.job.salary.toLocaleString()} FCFA (Salaire ${MONTHS[gameState.player.month]})`, 'positive');
    }

    if (businessIncome > 0) {
      addLog(`📈 BUSINESS : +${businessIncome.toLocaleString()} FCFA de revenus ce mois.`, 'positive');
    }
    
    if (totalMonthlyLoanPayment > 0) {
      addLog(`📉 PRÉLÈVEMENT BANCAIRE : -${totalMonthlyLoanPayment.toLocaleString()} FCFA (Remboursement prêt)`, 'negative');
    }

    if (childExpenses > 0) {
      addLog(`🍼 ENFANTS : -${childExpenses.toLocaleString()} FCFA de frais de scolarité et santé.`, 'negative');
    }

    if (finalRentExpenses > 0) {
      addLog(`🏠 LOGEMENT : -${Math.round(finalRentExpenses).toLocaleString()} FCFA de loyer/charges.`, 'negative');
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
      addLog(`❌ ÉCHEC : Ça n'a pas marché.`, 'negative');
    } else if (choice.actionType === 'NEW_RELATION') {
      const newRel: Relationship = {
        id: Date.now().toString(),
        name: choice.resultLog.split(' ')[0] || "Nouvelle Connaissance",
        type: 'Ami',
        level: 20
      };
      setGameState(prev => ({ ...prev, player: { ...prev.player, relations: [...prev.player.relations, newRel] }}));
    } else if (choice.actionType === 'MARRY' && choice.partnerId) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          relations: prev.player.relations.map(r => r.id === choice.partnerId ? { ...r, type: 'Conjoint', isSpouse: true, livingTogether: true, level: 100 } : r)
        }
      }));
      addLog(`💍 MARIAGE : Félicitations ! Tu es maintenant marié(e).`, 'positive');
    } else if (choice.actionType === 'COHABIT' && choice.partnerId) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          relations: prev.player.relations.map(r => r.id === choice.partnerId ? { ...r, livingTogether: true } : r)
        }
      }));
      addLog(`🏠 COHABITATION : Vous vivez maintenant ensemble !`, 'positive');
    } else if (choice.actionType === 'CHILD' && choice.partnerId) {
      const childName = "Petit(e) " + gameState.player.name.split(' ')[0];
      const newChild: Relationship = {
        id: Date.now().toString(),
        name: childName,
        type: 'Enfant',
        level: 100
      };
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          relations: [...prev.player.relations, newChild]
        }
      }));
      addLog(`👶 NAISSANCE : Bienvenue à ${childName} dans la famille !`, 'positive');
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
        {gameState.player.inventory.some(i => i.type === 'Phone') && (
          <button
            onClick={() => setActiveTab('smartphone')}
            className="absolute top-4 right-4 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-orange-500 animate-pulse"
          >
            <i className="fa-solid fa-mobile-screen-button"></i>
          </button>
        )}
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
               <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1 pb-20">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Tes Relations</h3>
                    <button onClick={findNewRelation} className="text-[8px] font-black bg-orange-600 text-white px-3 py-1.5 rounded-full uppercase">Faire une rencontre</button>
                  </div>
                  {gameState.player.relations.map(rel => (
                    <div key={rel.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col gap-3">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black uppercase">{rel.name[0]}</div>
                             <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rel.type} {rel.livingTogether ? '🏠' : ''}</p>
                               <p className="text-sm font-black text-slate-900">{rel.name}</p>
                             </div>
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-pink-500" style={{ width: `${rel.level}%` }} />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                          {rel.name === 'Vieux Père Koffi' ? (
                            <>
                              <button onClick={() => interactWithKoffi('conseil')} className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 py-2 rounded-lg">Conseil</button>
                              <button onClick={() => interactWithKoffi('biere')} className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 py-2 rounded-lg">Payer Bière</button>
                              <button onClick={() => interactWithKoffi('business')} className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 py-2 rounded-lg">Parler Biz</button>
                            </>
                          ) : (
                            <button onClick={() => socialInteract(rel.id, 'chat')} className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 py-2 rounded-lg">Discuter</button>
                          )}
                          <button onClick={() => socialInteract(rel.id, 'gift')} className="text-[8px] font-black uppercase text-purple-600 bg-purple-50 py-2 rounded-lg">Offrir Cadeau</button>
                          {rel.level > 40 && rel.type !== 'Enfant' && rel.type !== 'Famille' && (
                             <button onClick={() => socialInteract(rel.id, 'flirt')} className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 py-2 rounded-lg">Draguer</button>
                          )}
                          {rel.level > 70 && rel.type === 'Amour' && !rel.livingTogether && (
                             <button onClick={() => socialInteract(rel.id, 'cohabit')} className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 py-2 rounded-lg">Vivre ensemble</button>
                          )}
                          {rel.level > 85 && (rel.type === 'Amour' || rel.type === 'Conjoint') && !rel.isSpouse && (
                             <button onClick={() => socialInteract(rel.id, 'marry')} className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 py-2 rounded-lg">Mariage</button>
                          )}
                          {(rel.isSpouse || rel.livingTogether) && rel.type !== 'Enfant' && (
                             <button onClick={() => socialInteract(rel.id, 'child')} className="text-[8px] font-black uppercase text-sky-600 bg-sky-50 py-2 rounded-lg">Avoir Enfant</button>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            )}

            {activeTab === 'activites' && (
               <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => setActiveTab('boutique')} className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-shop text-orange-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Boutique</span>
                 </button>
                 <button onClick={goToMall} className="flex flex-col items-center justify-center p-4 bg-fuchsia-50 rounded-2xl border-2 border-fuchsia-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-bag-shopping text-fuchsia-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Mall</span>
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

            {activeTab === 'boutique' && (
              <div className="space-y-4 overflow-y-auto max-h-[400px] pb-10">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveTab('activites')} className="text-slate-400"><i className="fa-solid fa-arrow-left"></i></button>
                  <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Boutique Babi</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase">Téléphones & Gadgets</p>
                     <button onClick={() => buyItem({name: "Smartphone Android", price: 120000, type: "Phone"})} className="w-full flex justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-center">
                        <span className="text-sm font-bold">Smartphone Android</span>
                        <span className="text-xs font-black text-emerald-600">120.000 FCFA</span>
                     </button>
                   </div>
                   <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase">Cadeaux</p>
                     {GIFTS.map(g => (
                       <button key={g.id} onClick={() => buyItem({name: g.name, price: g.price, type: "Gift"})} className="w-full flex justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-center">
                          <span className="text-sm font-bold">{g.name}</span>
                          <span className="text-xs font-black text-emerald-600">{g.price.toLocaleString()} FCFA</span>
                       </button>
                     ))}
                   </div>
                   <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase">Véhicules</p>
                     {VEHICLES.map(v => (
                       <button key={v.id} onClick={() => buyVehicle(v)} className="w-full flex justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-center text-left">
                          <div>
                            <span className="text-sm font-bold block">{v.name}</span>
                            <span className="text-[8px] uppercase text-slate-400">{v.isBusiness ? 'Business Rentable' : 'Personnel'}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-600">{v.price.toLocaleString()} FCFA</span>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'smartphone' && (
               <div className="h-full bg-slate-900 rounded-[3rem] p-6 border-4 border-slate-800 shadow-inner relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-8 px-2">
                    <span className="text-[10px] font-bold text-white">Orange CI</span>
                    <span className="text-[10px] font-bold text-white">12:00</span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                     <button onClick={() => { setSelectedApp('bank'); setActiveTab('smartphone_app'); }} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-building-columns text-white text-xl"></i></div>
                        <span className="text-[9px] font-bold text-white uppercase">Banque</span>
                     </button>
                     <button onClick={() => { setSelectedApp('business'); setActiveTab('smartphone_app'); }} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-chart-line text-white text-xl"></i></div>
                        <span className="text-[9px] font-bold text-white uppercase">Business</span>
                     </button>
                     <button onClick={() => { setSelectedApp('dating'); setActiveTab('smartphone_app'); }} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-heart text-white text-xl"></i></div>
                        <span className="text-[9px] font-bold text-white uppercase">Rencontres</span>
                     </button>
                  </div>
                  <div className="mt-auto flex justify-center pb-4">
                     <button onClick={() => setActiveTab('vie')} className="w-12 h-1 bg-white/20 rounded-full"></button>
                  </div>
               </div>
            )}

            {activeTab === 'smartphone_app' && (
               <div className="h-full bg-white rounded-t-3xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveTab('smartphone')} className="text-slate-400"><i className="fa-solid fa-chevron-left"></i></button>
                    <h3 className="text-sm font-black uppercase tracking-widest">{selectedApp === 'bank' ? 'BABI BANK' : selectedApp === 'business' ? 'BABI BIZ' : 'BABI LOVE'}</h3>
                    <div className="w-4"></div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {selectedApp === 'bank' && (
                      <div className="space-y-4">
                         <div className="p-6 bg-slate-900 rounded-3xl text-white">
                            <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Solde Total</p>
                            <p className="text-2xl font-black">{gameState.player.stats.money.toLocaleString()} FCFA</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Tes Emprunts</p>
                            {gameState.player.loans.map(l => (
                              <div key={l.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                                 <span className="text-xs font-bold">{l.remainingAmount.toLocaleString()} FCFA</span>
                                 <span className="text-[10px] text-orange-600 font-black">{l.monthsRemaining} mois</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}

                    {selectedApp === 'business' && (
                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-2 mb-4">
                            <button onClick={() => launchBusiness('Boutique')} className="p-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase">Lancer Boutique (500k)</button>
                            <button onClick={() => launchBusiness('Maquis')} className="p-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase">Ouvrir Maquis (1M)</button>
                         </div>
                         <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase">Tes Actifs</p>
                           {gameState.player.businesses.map(b => (
                             <div key={b.id} className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                                <p className="font-black text-blue-900">{b.name}</p>
                                <p className="text-xs font-bold text-blue-600">Revenus mensuels: {b.monthlyRevenue.toLocaleString()} FCFA</p>
                             </div>
                           ))}
                         </div>
                         {gameState.player.businesses.length === 0 && <p className="text-center text-slate-400 py-10 italic">Aucun business à gérer.</p>}
                      </div>
                    )}

                    {selectedApp === 'dating' && (
                      <div className="space-y-4">
                         <div className="p-6 bg-rose-50 rounded-3xl text-center">
                            <i className="fa-solid fa-fire text-rose-500 text-3xl mb-2"></i>
                            <p className="text-sm font-bold text-rose-900 italic">"Trouve ton gbairé sur Babi Love"</p>
                         </div>
                         <button onClick={findNewRelation} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Lancer un Swipe</button>
                      </div>
                    )}
                  </div>
               </div>
            )}

            {activeTab === 'patrimoine' && (
              <div className="space-y-6 overflow-y-auto max-h-[400px] pb-10">
                <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Patrimoine & Business</h3>

                {/* Propriétés */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Immobilier</p>
                     <button onClick={() => setSelectedPropertyId('new')} className="text-[8px] font-black bg-blue-600 text-white px-2 py-1 rounded">Acheter/Louer</button>
                   </div>
                   {gameState.player.assets.properties.map(p => (
                     <div key={p.id} className="p-4 bg-white border-2 border-slate-100 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-black">{p.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">{p.location} - {p.type === 'OWN' ? 'Propriétaire' : 'Locataire'}</p>
                          </div>
                          <button onClick={() => setSelectedPropertyId(p.id)} className="text-[9px] font-black text-orange-600 uppercase">Meubler</button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {p.furnishings.map((f, i) => (
                            <span key={i} className="text-[8px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">{f.name}</span>
                          ))}
                        </div>
                     </div>
                   ))}
                </div>

                {/* Businesses */}
                <div className="space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mes Business</p>
                   {gameState.player.businesses.length === 0 && <p className="text-[10px] italic text-slate-400">Aucun business actif.</p>}
                   {gameState.player.businesses.map(b => (
                     <div key={b.id} className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black text-emerald-900">{b.name}</p>
                          <p className="text-[9px] text-emerald-600 uppercase font-bold">Type: {b.type}</p>
                        </div>
                        <p className="text-xs font-black text-emerald-700">+{b.monthlyRevenue.toLocaleString()} FCFA/mois</p>
                     </div>
                   ))}
                </div>

                {/* Banque */}
                <div className="space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Services Bancaires</p>
                   <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => takeLoan(200000, 10)} className="p-3 bg-blue-50 border-2 border-blue-100 rounded-2xl text-left">
                      <p className="text-[10px] font-black text-blue-600 uppercase">Prêt Consom.</p>
                      <p className="text-xs font-black">200.000 FCFA</p>
                    </button>
                    <button onClick={() => takeLoan(1000000, 24)} className="p-3 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-left">
                      <p className="text-[10px] font-black text-indigo-600 uppercase">Prêt Invest.</p>
                      <p className="text-xs font-black">1.000.000 FCFA</p>
                    </button>
                  </div>
                </div>

                {/* Modal Achat Maison / Meubler */}
                {selectedPropertyId && (
                  <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 overflow-y-auto max-h-[80vh]">
                       <div className="flex justify-between items-center mb-6">
                         <h4 className="text-sm font-black uppercase tracking-widest">{selectedPropertyId === 'new' ? 'Nouveau Logement' : 'Acheter des Meubles'}</h4>
                         <button onClick={() => setSelectedPropertyId(null)}><i className="fa-solid fa-xmark text-slate-400"></i></button>
                       </div>

                       {selectedPropertyId === 'new' ? (
                         <div className="space-y-4">
                           {NEIGHBORHOODS.map(n => (
                             <div key={n.name} className="p-4 border-2 border-slate-100 rounded-2xl space-y-3">
                                <p className="font-black text-slate-900">{n.name} <span className="text-[10px] text-orange-500">Prestige: {n.prestige}</span></p>
                                <div className="grid grid-cols-2 gap-2">
                                   <button onClick={() => { buyHouse(n, 'RENT'); setSelectedPropertyId(null); }} className="text-[10px] font-black bg-blue-50 text-blue-600 py-2 rounded-lg">LOUER ({n.rent.toLocaleString()}/m)</button>
                                   <button onClick={() => { buyHouse(n, 'OWN'); setSelectedPropertyId(null); }} className="text-[10px] font-black bg-emerald-50 text-emerald-600 py-2 rounded-lg">ACHETER ({n.basePrice.toLocaleString()})</button>
                                </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="space-y-3">
                           {FURNITURE_ITEMS.map(f => (
                             <button key={f.id} onClick={() => buyFurniture(f, selectedPropertyId)} className="w-full flex justify-between items-center p-4 border-2 border-slate-100 rounded-2xl">
                                <div className="text-left">
                                  <p className="text-sm font-bold">{f.name}</p>
                                  <p className="text-[8px] text-emerald-600 font-black uppercase">Santé +{f.healthBonus} | Bonheur +{f.happinessBonus}</p>
                                </div>
                                <p className="text-xs font-black text-emerald-600">{f.price.toLocaleString()} FCFA</p>
                             </button>
                           ))}
                         </div>
                       )}
                    </div>
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
