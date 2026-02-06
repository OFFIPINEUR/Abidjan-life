
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Stats, Job, LogEntry, Relationship, Property, Company, Loan, Business, Investment, BusinessType, PoliticalRank, Bank, Vehicle } from './types';
import { GeminiService } from './services/geminiService';

const INITIAL_STATS: Stats = {
  health: 100,
  happiness: 80,
  smarts: 30,
  looks: 60,
  stress: 10,
  money: 50000
};

const GET_INITIAL_GAME_STATE = (banks: Bank[]): GameState => ({
  isRegistered: false,
  timer: 180,
  player: {
    name: "",
    gender: "Homme",
    age: 18,
    month: 0,
    job: null,
    stats: INITIAL_STATS,
    relations: [
      { id: '1', name: 'Vieux Père Koffi', type: 'Ami', level: 75, gender: 'Homme' },
      { id: '2', name: 'Maman Brigitte', type: 'Famille', level: 95, gender: 'Femme' }
    ],
    assets: { properties: [], vehicles: [] },
    loans: [],
    creditScore: 0,
    politicalState: {
      partyId: null,
      rank: null,
      membershipFee: 0,
      salary: 0
    },
    education: "Baccalauréat",
    educationState: {
      currentDegree: null,
      specialty: null,
      monthsCompleted: 0,
      degreesObtained: ["Baccalauréat"]
    },
    logs: [],
    inventory: [],
    businesses: [],
    investments: [],
    settings: {
      wallpaper: WALLPAPERS[0]
    }
  },
  marketBusinesses: [],
  banks: banks
});

const COMPANIES: Company[] = [
  { id: '1', name: "Orange-CI", industry: "Telecom", prestige: 85 },
  { id: '2', name: "SOTRA", industry: "Transport", prestige: 40 },
  { id: '3', name: "CIE", industry: "Énergie", prestige: 75 },
  { id: '4', name: "Maquis 'Le Défi'", industry: "Restauration", prestige: 20 },
  { id: '5', name: "BNI", industry: "Banque", prestige: 90 },
  { id: '6', name: "Start-up 'Babi Tech'", industry: "Technologie", prestige: 65 },
  { id: '7', name: "Éducation Nationale", industry: "Secteur Public", prestige: 55 },
  { id: '8', name: "Studio Graphik-Babi", industry: "Design", prestige: 70 },
  { id: '9', name: "Sécurité 'Vigilance'", industry: "Services", prestige: 30 },
  { id: '10', name: "Clinique PISAM", industry: "Santé", prestige: 80 },
  { id: '11', name: "PFO Africa", industry: "BTP", prestige: 85 },
  { id: '12', name: "Palais de Justice", industry: "Droit", prestige: 75 }
];

const JOBS: Job[] = [
  // Secteur Informel
  { company: COMPANIES[3], title: "Gérant de Maquis", salary: 85000, stressLevel: 45, requirement: 10, workingHours: "17h - 02h", category: "Secteur Informel", isCDI: false },
  { company: COMPANIES[1], title: "Laveur de Bus", salary: 55000, stressLevel: 65, requirement: 5, workingHours: "05h - 14h", category: "Secteur Informel", isCDI: false },
  { company: COMPANIES[1], title: "Chauffeur de Gbaka", salary: 120000, stressLevel: 85, requirement: 15, workingHours: "04h - 22h", category: "Secteur Informel", isCDI: false },
  { company: COMPANIES[8], title: "Agent de Sécurité", salary: 110000, stressLevel: 40, requirement: 10, workingHours: "19h - 07h", category: "Secteur Informel", isCDI: false },
  { company: COMPANIES[3], title: "Vendeur de Garba", salary: 75000, stressLevel: 50, requirement: 5, workingHours: "07h - 16h", category: "Secteur Informel", isCDI: false },
  { company: COMPANIES[3], title: "Djoutai (Dockeur)", salary: 95000, stressLevel: 90, requirement: 10, workingHours: "06h - 18h", category: "Secteur Informel", isCDI: false },

  // Informatique & Tech
  { company: COMPANIES[5], title: "Technicien Maintenance", salary: 250000, stressLevel: 40, requirement: 40, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Informatique', category: "Informatique & Tech", isCDI: true },
  { company: COMPANIES[5], title: "Développeur Web Junior", salary: 450000, stressLevel: 60, requirement: 60, workingHours: "09h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Informatique', category: "Informatique & Tech", isCDI: true },
  { company: COMPANIES[0], title: "Ingénieur Logiciel", salary: 850000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Informatique', category: "Informatique & Tech", isCDI: true },
  { company: COMPANIES[5], title: "Expert IA / Data Scientist", salary: 1500000, stressLevel: 65, requirement: 95, workingHours: "08h - 18h", requiredDegree: 'Doctorat', requiredSpecialty: 'Informatique', category: "Informatique & Tech", isCDI: true },
  { company: COMPANIES[0], title: "Analyste Cyber-sécurité", salary: 900000, stressLevel: 80, requirement: 85, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Informatique', category: "Informatique & Tech", isCDI: true },

  // Droit & Justice
  { company: COMPANIES[11], title: "Clerc d'Avocat", salary: 200000, stressLevel: 50, requirement: 45, workingHours: "08h - 18h", requiredDegree: 'BTS', requiredSpecialty: 'Droit', category: "Droit & Justice", isCDI: true },
  { company: COMPANIES[8], title: "Assistant Juridique", salary: 350000, stressLevel: 45, requirement: 55, workingHours: "08h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Droit', category: "Droit & Justice", isCDI: true },
  { company: COMPANIES[4], title: "Juriste d'Affaires", salary: 750000, stressLevel: 75, requirement: 85, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Droit', category: "Droit & Justice", isCDI: true },
  { company: COMPANIES[6], title: "Professeur de Droit", salary: 1200000, stressLevel: 50, requirement: 95, workingHours: "08h - 16h", requiredDegree: 'Doctorat', requiredSpecialty: 'Droit', category: "Droit & Justice", isCDI: true },
  { company: COMPANIES[11], title: "Magistrat Junior", salary: 800000, stressLevel: 85, requirement: 90, workingHours: "08h - 17h", requiredDegree: 'Master', requiredSpecialty: 'Droit', category: "Droit & Justice", isCDI: true },

  // Comptabilité & Finance
  { company: COMPANIES[4], title: "Aide Comptable", salary: 180000, stressLevel: 40, requirement: 40, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance", isCDI: true },
  { company: COMPANIES[4], title: "Comptable Junior", salary: 400000, stressLevel: 65, requirement: 65, workingHours: "08h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance", isCDI: true },
  { company: COMPANIES[4], title: "Contrôleur de Gestion", salary: 800000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance", isCDI: true },
  { company: COMPANIES[4], title: "Expert Comptable", salary: 1800000, stressLevel: 85, requirement: 95, workingHours: "08h - 20h", requiredDegree: 'Doctorat', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance", isCDI: true },
  { company: COMPANIES[4], title: "Analyste Financier", salary: 950000, stressLevel: 75, requirement: 85, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance", isCDI: true },

  // Ressources Humaines
  { company: COMPANIES[0], title: "Gestionnaire de Paie", salary: 280000, stressLevel: 45, requirement: 50, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines", isCDI: true },
  { company: COMPANIES[0], title: "Chargé de Recrutement", salary: 380000, stressLevel: 50, requirement: 55, workingHours: "08h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines", isCDI: true },
  { company: COMPANIES[0], title: "Responsable RH", salary: 900000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines", isCDI: true },
  { company: COMPANIES[0], title: "Directeur RH", salary: 1600000, stressLevel: 80, requirement: 95, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines", isCDI: true },

  // Santé
  { company: COMPANIES[9], title: "Aide-Soignant", salary: 150000, stressLevel: 60, requirement: 30, workingHours: "07h - 19h", requiredDegree: 'Certification', requiredSpecialty: 'Santé', category: "Santé", isCDI: true },
  { company: COMPANIES[9], title: "Infirmier d'État", salary: 350000, stressLevel: 70, requirement: 60, workingHours: "07h - 19h", requiredDegree: 'Licence', requiredSpecialty: 'Santé', category: "Santé", isCDI: true },
  { company: COMPANIES[9], title: "Médecin Généraliste", salary: 850000, stressLevel: 80, requirement: 85, workingHours: "08h - 18h (Garde)", requiredDegree: 'Master', requiredSpecialty: 'Santé', category: "Santé", isCDI: true },
  { company: COMPANIES[9], title: "Chirurgien Spécialiste", salary: 2500000, stressLevel: 95, requirement: 98, workingHours: "Irrégulier", requiredDegree: 'Doctorat', requiredSpecialty: 'Santé', category: "Santé", isCDI: true },

  // BTP & Ingénierie
  { company: COMPANIES[10], title: "Chef de Chantier Junior", salary: 400000, stressLevel: 75, requirement: 55, workingHours: "07h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Génie Civil', category: "BTP & Ingénierie", isCDI: true },
  { company: COMPANIES[10], title: "Ingénieur Structure", salary: 900000, stressLevel: 70, requirement: 85, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Génie Civil', category: "BTP & Ingénierie", isCDI: true },
  { company: COMPANIES[10], title: "Architecte", salary: 1200000, stressLevel: 65, requirement: 90, workingHours: "09h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Architecture', category: "BTP & Ingénierie", isCDI: true },

  // Marketing & Communication
  { company: COMPANIES[7], title: "Graphiste Junior", salary: 220000, stressLevel: 45, requirement: 45, workingHours: "09h - 18h", requiredDegree: 'BTS', requiredSpecialty: 'Communication', category: "Marketing & Communication", isCDI: true },
  { company: COMPANIES[7], title: "Community Manager", salary: 300000, stressLevel: 40, requirement: 50, workingHours: "09h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Communication', category: "Marketing & Communication", isCDI: true },
  { company: COMPANIES[0], title: "Chef de Produit", salary: 700000, stressLevel: 65, requirement: 75, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Marketing', category: "Marketing & Communication", isCDI: true },
  { company: COMPANIES[0], title: "Directeur Marketing", salary: 1800000, stressLevel: 85, requirement: 95, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Marketing', category: "Marketing & Communication", isCDI: true }
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

const VEHICLES: Vehicle[] = [
  { id: 'v1', name: "Gbaka (Occasion)", brand: "Isuzu", dealership: "Occasions Yopougon", price: 8000000, prestige: 10, isBusiness: true },
  { id: 'v2', name: "Toyota Corolla", brand: "Toyota", dealership: "CFAO Motors", price: 12000000, prestige: 40, isBusiness: false },
  { id: 'v3', name: "Range Rover Vogue", brand: "Land Rover", dealership: "Concessionnaire Chic", price: 65000000, prestige: 95, isBusiness: false },
  { id: 'v4', name: "Sotra (Mini bus)", brand: "Tata", dealership: "SOTRA Pro", price: 15000000, prestige: 20, isBusiness: true },
  { id: 'v5', name: "Moto Sunda", brand: "Sunda", dealership: "Babi Moto", price: 600000, prestige: 5, isBusiness: false },
  { id: 'v6', name: "Mercedes Classe S", brand: "Mercedes", dealership: "Concessionnaire Chic", price: 85000000, prestige: 98, isBusiness: false },
  { id: 'v7', name: "BMW M4", brand: "BMW", dealership: "Concessionnaire Chic", price: 55000000, prestige: 90, isBusiness: false },
  { id: 'v8', name: "Peugeot 408", brand: "Peugeot", dealership: "CFAO Motors", price: 35000000, prestige: 75, isBusiness: false },
  { id: 'v9', name: "V8 (Toyota Land Cruiser)", brand: "Toyota", dealership: "CFAO Motors", price: 75000000, prestige: 96, isBusiness: false }
];

export const POLITICAL_PARTIES = [
  { id: 'p1', name: "Parti du Progrès Ivoirien (PPI)", ideology: "Libéralisme", color: "bg-orange-600", entrySmarts: 40 },
  { id: 'p2', name: "Union pour la Renaissance (UR)", ideology: "Socialisme", color: "bg-emerald-600", entrySmarts: 45 },
  { id: 'p3', name: "Rassemblement des Éléphants (RE)", ideology: "Nationalisme", color: "bg-blue-600", entrySmarts: 50 }
];

const BANKS: Bank[] = [
  { id: 'b1', name: "BNI (Banque Nationale)", interestRate: 0.12, minSalary: 100000, requireCDI: false, minCreditScore: 0 },
  { id: 'b2', name: "Société Générale CI", interestRate: 0.09, minSalary: 300000, requireCDI: true, minCreditScore: 3 },
  { id: 'b3', name: "NSIA Banque", interestRate: 0.10, minSalary: 200000, requireCDI: true, minCreditScore: 1 },
  { id: 'b4', name: "BACI (Banque Atlantique)", interestRate: 0.11, minSalary: 150000, requireCDI: false, minCreditScore: 0 }
];

const WALLPAPERS = [
  "bg-gradient-to-br from-blue-500 to-indigo-700",
  "bg-gradient-to-br from-orange-400 to-rose-600",
  "bg-gradient-to-br from-slate-800 to-slate-950",
  "bg-gradient-to-br from-emerald-400 to-teal-700",
  "bg-gradient-to-br from-fuchsia-500 to-purple-800"
];

const BUSINESS_CONFIG: Record<string, { baseCost: number, baseRevenue: number }> = {
  'Kbine': { baseCost: 100000, baseRevenue: 15000 },
  'Kiosque': { baseCost: 300000, baseRevenue: 40000 },
  'Boutique': { baseCost: 600000, baseRevenue: 80000 },
  'Maquis': { baseCost: 1200000, baseRevenue: 180000 },
  'Garbadrome': { baseCost: 800000, baseRevenue: 100000 },
  'Lavage Auto': { baseCost: 1500000, baseRevenue: 220000 },
  'Pressing': { baseCost: 3000000, baseRevenue: 450000 },
  'Gbaka': { baseCost: 2000000, baseRevenue: 300000 },
  'Transport': { baseCost: 2500000, baseRevenue: 350000 }
};

const SAVE_KEY = 'abidjan_life_save_v1';

interface UIFeedback {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [savePlayerName, setSavePlayerName] = useState("");
  const [gameState, setGameState] = useState<GameState>(GET_INITIAL_GAME_STATE(BANKS));

  const [activeTab, setActiveTab] = useState<'vie' | 'travail' | 'social' | 'patrimoine' | 'activites' | 'boutique' | 'smartphone' | 'smartphone_app'>('vie');
  const [selectedApp, setSelectedApp] = useState<'bank' | 'business' | 'dating' | 'politics' | 'settings' | null>(null);
  const [businessTab, setBusinessTab] = useState<'mine' | 'launch' | 'market' | 'invest'>('mine');
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(true);
  const [feedbacks, setFeedbacks] = useState<UIFeedback[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const gemini = new GeminiService();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavePlayerName(parsed.player.name);
          setShowStartMenu(true);
          setShowRegister(false);
        } catch (e) {
          console.error("Corrupted save", e);
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState.isRegistered) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleContinue = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(parsed);
        setShowStartMenu(false);
        addLog("Bon retour à Babi !", "positive");
      } catch (e) {
        console.error("Failed to load save", e);
        handleNewGame();
      }
    }
  };

  const handleNewGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setGameState(GET_INITIAL_GAME_STATE(BANKS));
    setShowRegister(true);
    setShowStartMenu(false);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.player.logs]);

  useEffect(() => {
    if (!gameState.isRegistered || showSplash) return;
    refreshMarket();

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

  const triggerHospital = async () => {
    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'random_event', "Le joueur s'est évanoui de fatigue et a été transporté d'urgence à la PISAM. Il doit payer des frais médicaux et se reposer.");
    if (event) {
      event.choices = event.choices.map((c: any) => ({
        ...c,
        actionType: 'HOSPITAL_STAY'
      }));
      setCurrentEvent(event);
    }
    setLoading(false);
  };

  const findNewFriend = async () => {
    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'social', `Le joueur cherche à se faire un nouvel ami garçon (frangin) pour le foot ou le maquis. Genre du joueur: ${gameState.player.gender}.`);
    if (event) {
      event.choices = event.choices.map((c: any) => ({
        ...c,
        actionType: 'NEW_FRIEND'
      }));
      setCurrentEvent(event);
    }
    setLoading(false);
  };

  const triggerRandomChallenge = async () => {
    if (currentEvent || loading) return;
    setLoading(true);

    const type = (gameState.player.job && Math.random() > 0.5) ? 'job_challenge' : 'random_event';
    const extra = type === 'job_challenge'
      ? `Challenge imprévu au poste de ${gameState.player.job?.title}. Un problème à régler immédiatement.`
      : "Événement imprévu dans les rues d'Abidjan (ex: renverser une table au maquis par accident, rencontre inattendue, petit problème de transport, une galère nouchi).";

    const event = await gemini.generateNarrative(gameState, type as any, extra);
    if (event) setCurrentEvent(event);

    // Vérification hospitalisation
    if (gameState.player.stats.health <= 0) {
      triggerHospital();
    }

    setLoading(false);
  };

  const buyFurniture = (furniture: any, propertyId: string, e?: React.MouseEvent) => {
    if (gameState.player.stats.money < furniture.price) {
      addLog("Pas assez d'argent pour ce meuble !", "negative");
      return;
    }
    updateStats({ money: -furniture.price }, e?.clientX, e?.clientY);
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
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

  const buyVehicle = (vehicle: any, e?: React.MouseEvent) => {
    if (gameState.player.stats.money < vehicle.price) {
      addLog("Pas assez d'argent pour ce véhicule !", "negative");
      return;
    }
    updateStats({ money: -vehicle.price, looks: Math.round(vehicle.prestige/5) }, e?.clientX, e?.clientY);
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

  const buyHouse = (neighborhood: any, type: 'RENT' | 'OWN', e?: React.MouseEvent) => {
    const price = type === 'OWN' ? neighborhood.basePrice : neighborhood.rent;
    if (gameState.player.stats.money < price) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }
    updateStats({ money: -price, happiness: 20 }, e?.clientX, e?.clientY);
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
        assets: {
          ...prev.player.assets,
          properties: [...prev.player.assets.properties, newProperty]
        }
      }
    }));
    addLog(`🏠 LOGEMENT : Tu as emménagé à ${neighborhood.name} (${type === 'OWN' ? 'Propriétaire' : 'Locataire'}).`, "positive");
  };

  const launchBusiness = (type: any, neighborhoodName: string, e?: React.MouseEvent) => {
    const neighborhood = NEIGHBORHOODS.find(n => n.name === neighborhoodName) || NEIGHBORHOODS[0];
    const config = BUSINESS_CONFIG[type];

    const multiplier = 1 + (neighborhood.prestige / 100);
    const cost = Math.round(config.baseCost * multiplier);
    const revenue = Math.round(config.baseRevenue * multiplier);

    if (gameState.player.stats.money < cost) {
      addLog(`Pas assez d'argent pour lancer ce business à ${neighborhoodName} (${cost.toLocaleString()} FCFA nécessaires)`, "negative");
      return;
    }

    updateStats({ money: -cost, stress: 15 }, e?.clientX, e?.clientY);

    const newBusiness: Business = {
      id: Date.now().toString(),
      name: `${type} de ${gameState.player.name.split(' ')[0]}`,
      type: type,
      location: neighborhoodName,
      investment: cost,
      monthlyRevenue: revenue,
      level: 1
    };

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        businesses: [...prev.player.businesses, newBusiness]
      }
    }));
    addLog(`🚀 BUSINESS : Tu as lancé ton propre business de ${type} à ${neighborhoodName} !`, "positive");
  };

  const refreshMarket = () => {
    const types: any[] = ['Kbine', 'Kiosque', 'Boutique', 'Maquis', 'Garbadrome', 'Lavage Auto', 'Pressing', 'Gbaka'];
    const names = ["Chez l'Oncle", "Espace Pro", "Le Relais", "Babi Biz", "Dja Foule", "Coin Chic", "Étoile de Babi"];

    const newList: Business[] = [];
    for (let i = 0; i < 4; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const neighborhood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
      const config = BUSINESS_CONFIG[type];
      const multiplier = 0.8 + (Math.random() * 0.5) + (neighborhood.prestige / 100);
      const cost = Math.round(config.baseCost * multiplier);
      const revenue = Math.round(config.baseRevenue * (0.9 + Math.random() * 0.3) * (1 + neighborhood.prestige / 100));

      newList.push({
        id: `market-${Date.now()}-${i}`,
        name: `${type} ${names[Math.floor(Math.random() * names.length)]}`,
        type,
        location: neighborhood.name,
        investment: cost,
        monthlyRevenue: revenue,
        level: Math.floor(Math.random() * 3) + 1
      });
    }
    setGameState(prev => ({ ...prev, marketBusinesses: newList }));
  };

  const buyMarketBusiness = (business: Business, e?: React.MouseEvent) => {
    if (gameState.player.stats.money < business.investment) {
      addLog("Pas assez d'argent pour racheter ce business !", "negative");
      return;
    }

    updateStats({ money: -business.investment, stress: 10 }, e?.clientX, e?.clientY);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        businesses: [...prev.player.businesses, { ...business, id: Date.now().toString() }]
      },
      marketBusinesses: prev.marketBusinesses.filter(b => b.id !== business.id)
    }));
    addLog(`💼 RACHAT : Tu as racheté ${business.name} à ${business.location} !`, "positive");
  };

  const expandBusiness = (businessId: string, e?: React.MouseEvent) => {
    const business = gameState.player.businesses.find(b => b.id === businessId);
    if (!business) return;

    const expansionCost = Math.round(business.investment * 0.5 * business.level);
    if (gameState.player.stats.money < expansionCost) {
      addLog(`Pas assez d'argent pour agrandir ${business.name} (${expansionCost.toLocaleString()} FCFA requis)`, "negative");
      return;
    }

    updateStats({ money: -expansionCost, stress: 5 }, e?.clientX, e?.clientY);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        businesses: prev.player.businesses.map(b =>
          b.id === businessId
            ? { ...b, level: b.level + 1, monthlyRevenue: Math.round(b.monthlyRevenue * 1.4) }
            : b
        )
      }
    }));
    addLog(`📈 EXPANSION : ${business.name} est passé au niveau ${business.level + 1} !`, "positive");
  };

  const investMoney = (type: 'SAVINGS' | 'STOCK' | 'REAL_ESTATE', amount: number, e?: React.MouseEvent) => {
    if (gameState.player.stats.money < amount) {
      addLog("Pas assez d'argent pour cet investissement !", "negative");
      return;
    }

    updateStats({ money: -amount }, e?.clientX, e?.clientY);

    let yieldRate = 0;
    let name = "";
    if (type === 'SAVINGS') {
      yieldRate = 0.005; // 0.5% par mois
      name = "Compte Épargne";
    } else if (type === 'STOCK') {
      yieldRate = 0.015; // 1.5% en moyenne
      name = "Portefeuille Action";
    } else {
      yieldRate = 0.008; // 0.8% loyer
      name = "Investissement Immobilier";
    }

    const newInvestment: Investment = {
      id: Date.now().toString(),
      name,
      type,
      initialAmount: amount,
      currentValue: amount,
      monthlyYield: yieldRate
    };

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        investments: [...prev.player.investments, newInvestment]
      }
    }));
    addLog(`🏦 INVESTISSEMENT : Tu as placé ${amount.toLocaleString()} FCFA en ${name}.`, "positive");
  };

  const buyItem = (item: any, e?: React.MouseEvent) => {
    if (gameState.player.stats.money < item.price) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }
    updateStats({ money: -item.price }, e?.clientX, e?.clientY);
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        inventory: [...prev.player.inventory, { id: Date.now().toString(), name: item.name, type: item.type, value: item.price }]
      }
    }));
    addLog(`🛒 ACHAT : ${item.name} ajouté à ton inventaire.`, "positive");
  };

  const socialInteract = async (relId: string, action: 'chat' | 'flirt' | 'gift' | 'marry' | 'cohabit' | 'child' | 'become_partner' | 'separate') => {
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

    const event = await gemini.generateNarrative(gameState,
      action === 'become_partner' ? 'become_partner' :
      action === 'separate' ? 'breakup' :
      action === 'flirt' || action === 'marry' ? 'dating' : 'social',
      extra
    );
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
      } else if (action === 'become_partner') {
        event.choices = event.choices.map((c: any) => ({
          ...c,
          actionType: c.text.toLowerCase().includes('oui') ? 'BECOME_PARTNER' : 'FAIL',
          partnerId: relId
        }));
      } else if (action === 'separate') {
        event.choices = event.choices.map((c: any) => ({
          ...c,
          actionType: 'SEPARATE',
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

  const addFeedback = (text: string, x: number, y: number, color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFeedbacks(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    }, 1500);
  };

  const updateStats = (diff: Partial<Stats>, x?: number, y?: number) => {
    if (x && y) {
      if (diff.health) addFeedback(`${diff.health > 0 ? '+' : ''}${diff.health} Santé`, x, y - 20, diff.health > 0 ? 'text-rose-500' : 'text-rose-700');
      if (diff.happiness) addFeedback(`${diff.happiness > 0 ? '+' : ''}${diff.happiness} Joie`, x + 20, y, diff.happiness > 0 ? 'text-amber-500' : 'text-amber-700');
      if (diff.money) addFeedback(`${diff.money > 0 ? '+' : ''}${diff.money.toLocaleString()} FCFA`, x, y + 20, diff.money > 0 ? 'text-emerald-500' : 'text-rose-500');
      if (diff.stress) addFeedback(`${diff.stress > 0 ? '+' : ''}${diff.stress} Stress`, x - 20, y, diff.stress > 0 ? 'text-orange-500' : 'text-blue-500');
      if (diff.smarts) addFeedback(`${diff.smarts > 0 ? '+' : ''}${diff.smarts} Smarts`, x, y, 'text-sky-500');
      if (diff.looks) addFeedback(`${diff.looks > 0 ? '+' : ''}${diff.looks} Looks`, x, y, 'text-fuchsia-500');
    }

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
    
    // Études automatiques
    let eduCompleted = false;
    let completedDegreeName = "";
    const currentEdu = gameState.player.educationState;

    const totalMonthlyLoanPayment = gameState.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    const hasActiveLoans = gameState.player.loans.length > 0;
    
    const businessIncome = gameState.player.businesses.reduce((acc, b) => acc + b.monthlyRevenue, 0);
    const investmentIncome = gameState.player.investments.reduce((acc, inv) => acc + Math.round(inv.currentValue * inv.monthlyYield), 0);
    const politicalIncome = gameState.player.politicalState.salary;
    const politicalFee = gameState.player.politicalState.membershipFee;
    const childrenCount = gameState.player.relations.filter(r => r.type === 'Enfant').length;
    const totalChildSupport = gameState.player.relations.reduce((acc, r) => acc + (r.childSupport || 0), 0);
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

      const netIncome = monthlySalary + businessIncome + investmentIncome + politicalIncome - totalMonthlyLoanPayment - childExpenses - finalRentExpenses - totalChildSupport - politicalFee;

      const updatedInvestments = prev.player.investments.map(inv => {
        if (inv.type === 'STOCK') {
           const fluctuation = (Math.random() * 0.07) - 0.02;
           return { ...inv, currentValue: Math.round(inv.currentValue * (1 + fluctuation)) };
        }
        return inv;
      });

      // Bonus santé/bonheur des meubles
      const healthBonus = prev.player.assets.properties.reduce((acc, p) => acc + p.furnishings.reduce((fAcc, f) => fAcc + f.healthBonus, 0), 0) / 10;
      const happyBonus = prev.player.assets.properties.reduce((acc, p) => acc + p.furnishings.reduce((fAcc, f) => fAcc + f.happinessBonus, 0), 0) / 10;

      let newEduState = { ...prev.player.educationState };
      if (newEduState.currentDegree) {
        newEduState.monthsCompleted += 1;
        const requiredMonths = newEduState.currentDegree === 'BTS' ? 3 : (newEduState.currentDegree === 'Certification' ? 2 : 6);

        if (newEduState.monthsCompleted >= requiredMonths) {
          eduCompleted = true;
          completedDegreeName = newEduState.currentDegree;
          newEduState.degreesObtained = [...newEduState.degreesObtained, newEduState.currentDegree];
          newEduState.currentDegree = null;
          newEduState.monthsCompleted = 0;
        }
      }

      const isStudyingAndWorking = prev.player.job && prev.player.educationState.currentDegree;
      const politicalPrestigeBonus = prev.player.politicalState.rank === 'Maire' ? 5 : (prev.player.politicalState.rank === 'Député' ? 8 : 0);

      return {
        ...prev,
        player: {
          ...prev.player,
          age: nextAge,
          month: nextMonthIndex,
          loans: updatedLoans,
          creditScore: prev.player.creditScore + (hasActiveLoans ? 1 : 0),
          investments: updatedInvestments,
          education: completedDegreeName || prev.player.education,
          educationState: newEduState,
          stats: {
            ...prev.player.stats,
            money: prev.player.stats.money + netIncome,
            health: Math.min(100, Math.max(0, prev.player.stats.health + healthBonus - (prev.player.age > 40 && nextMonthIndex === 0 ? 3 : 0) - (isStudyingAndWorking ? 8 : 0))),
            happiness: Math.min(100, prev.player.stats.happiness + happyBonus),
            looks: Math.min(100, prev.player.stats.looks + politicalPrestigeBonus),
            stress: Math.max(0, Math.min(100, prev.player.stats.stress + (prev.player.job ? 2 : 0) + (hasActiveLoans ? 5 : -5) + (childrenCount * 2) + (isStudyingAndWorking ? 15 : 0)))
          }
        }
      };
    });

    if (eduCompleted) {
      addLog(`🎓 DIPLÔME OBTENU : Félicitations ! Tu as terminé ton ${completedDegreeName}.`, 'positive');
    }

    if (gameState.player.job && gameState.player.educationState.currentDegree) {
      addLog(`😫 SURMENAGE : Travailler et étudier en même temps t'épuise énormément !`, 'negative');
    }

    if (gameState.player.job) {
      addLog(`💰 VIREMENT REÇU : +${gameState.player.job.salary.toLocaleString()} FCFA (Salaire ${MONTHS[gameState.player.month]})`, 'positive');
    }

    if (businessIncome > 0) {
      addLog(`📈 BUSINESS : +${businessIncome.toLocaleString()} FCFA de revenus ce mois.`, 'positive');
    }

    if (investmentIncome > 0) {
      addLog(`🏦 PLACEMENTS : +${investmentIncome.toLocaleString()} FCFA de dividendes/loyers.`, 'positive');
    }

    if (politicalIncome > 0) {
      addLog(`🚩 POLITIQUE : +${politicalIncome.toLocaleString()} FCFA d'indemnités.`, 'positive');
    }

    if (politicalFee > 0) {
      addLog(`🚩 POLITIQUE : -${politicalFee.toLocaleString()} FCFA de cotisation.`, 'negative');
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

    if (totalChildSupport > 0) {
      addLog(`🍼 PENSION : -${totalChildSupport.toLocaleString()} FCFA de pension alimentaire.`, 'negative');
    }

    refreshMarket();
    if (event) setCurrentEvent(event);

    // Vérification hospitalisation
    if (gameState.player.stats.health <= 0) {
      triggerHospital();
    }

    setLoading(false);
  };

  const takeLoan = (bankId: string, amount: number, duration: number) => {
    const bank = gameState.banks.find(b => b.id === bankId);
    if (!bank) return;

    const monthlySalary = gameState.player.job?.salary || 0;
    const isCDI = gameState.player.job?.isCDI || false;

    if (monthlySalary < bank.minSalary) {
      addLog(`❌ BANQUE : Salaire insuffisant pour un prêt chez ${bank.name}.`, "negative");
      return;
    }

    if (bank.requireCDI && !isCDI) {
      addLog(`❌ BANQUE : Un contrat CDI est requis pour emprunter chez ${bank.name}.`, "negative");
      return;
    }

    if (gameState.player.creditScore < bank.minCreditScore) {
      addLog(`❌ BANQUE : Ton historique de crédit est insuffisant pour ${bank.name}.`, "negative");
      return;
    }

    const totalToRepay = amount * (1 + bank.interestRate);
    const monthlyPayment = Math.round(totalToRepay / duration);
    
    const currentTotalMonthlyPayment = gameState.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    if (monthlyPayment + currentTotalMonthlyPayment > monthlySalary * 0.4) {
        addLog(`❌ BANQUE : Taux d'endettement trop élevé pour ton salaire !`, "negative");
        return;
    }

    const newLoan: Loan = {
      id: Date.now().toString(),
      bankId: bank.id,
      amount,
      remainingAmount: totalToRepay,
      monthlyPayment,
      interestRate: bank.interestRate,
      durationMonths: duration,
      monthsRemaining: duration
    };

    updateStats({ money: amount, stress: 10 });
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        loans: [...prev.player.loans, newLoan]
      }
    }));

    addLog(`🏦 PRÊT ACCORDÉ : ${bank.name} t'a versé ${amount.toLocaleString()} FCFA.`, 'positive');
  };

  const enrollDegree = (degree: 'BTS' | 'Licence' | 'Master' | 'Doctorat' | 'Certification', specialty: string, e?: React.MouseEvent) => {
    const fees = { 'Certification': 50000, 'BTS': 100000, 'Licence': 200000, 'Master': 500000, 'Doctorat': 1000000 };
    const fee = fees[degree];

    if (gameState.player.stats.money < fee) {
      addLog(`❌ Pas assez d'argent pour l'inscription en ${degree} (${fee.toLocaleString()} FCFA).`, 'negative');
      return;
    }

    if (degree === 'Master' && !gameState.player.educationState.degreesObtained.includes('Licence')) {
      addLog("❌ Tu dois avoir une Licence avant de t'inscrire en Master.", 'negative');
      return;
    }
    if (degree === 'Doctorat' && !gameState.player.educationState.degreesObtained.includes('Master')) {
      addLog("❌ Tu dois avoir un Master avant de t'inscrire en Doctorat.", 'negative');
      return;
    }

    updateStats({ money: -fee }, e?.clientX, e?.clientY);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        educationState: {
          ...prev.player.educationState,
          currentDegree: degree,
          specialty: specialty,
          monthsCompleted: 0
        }
      }
    }));
    addLog(`🎓 ÉTUDES : Inscription en ${degree} (${specialty}) réussie !`, 'positive');
  };


  const applyForJob = async (job: Job) => {
    if (gameState.player.stats.smarts < job.requirement) {
      addLog(`❌ Dossier rejeté : Niveau d'intelligence insuffisant.`, 'negative');
      return;
    }

    if (job.requiredDegree && !gameState.player.educationState.degreesObtained.includes(job.requiredDegree)) {
      addLog(`❌ Dossier rejeté : Diplôme de ${job.requiredDegree} requis.`, 'negative');
      return;
    }

    if (job.requiredSpecialty && gameState.player.educationState.specialty !== job.requiredSpecialty) {
       // On vérifie si un des diplômes obtenus correspond à la spécialité ?
       // Pour simplifier, on vérifie la spécialité actuelle ou la dernière ?
       // Ajoutons specialty aux degreesObtained ? Non, gardons une trace plus simple.
       // Disons que specialty est global pour l'instant ou lié au dernier diplôme.
       if (gameState.player.educationState.specialty !== job.requiredSpecialty) {
         addLog(`❌ Dossier rejeté : Spécialité ${job.requiredSpecialty} requise.`, 'negative');
         return;
       }
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

  const handleChoice = (choice: any, e?: React.MouseEvent) => {
    updateStats(choice.effect, e?.clientX, e?.clientY);

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
        level: 20,
        gender: Math.random() > 0.5 ? 'Homme' : 'Femme'
      };
      setGameState(prev => ({ ...prev, player: { ...prev.player, relations: [...prev.player.relations, newRel] }}));
    } else if (choice.actionType === 'NEW_FRIEND') {
      const newRel: Relationship = {
        id: Date.now().toString(),
        name: choice.resultLog.split(' ')[0] || "Nouveau Frangin",
        type: 'Ami',
        level: 25,
        gender: 'Homme'
      };
      setGameState(prev => ({ ...prev, player: { ...prev.player, relations: [...prev.player.relations, newRel] }}));
    } else if (choice.actionType === 'BECOME_PARTNER' && choice.partnerId) {
      const hasSpouse = gameState.player.relations.some(r => r.isSpouse);
      const relType = hasSpouse ? (gameState.player.gender === 'Homme' ? 'Maîtresse' : 'Amant') : 'Petit(e) ami(e)';

      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          relations: prev.player.relations.map(r => r.id === choice.partnerId ? { ...r, type: relType, isPartner: true } : r)
        }
      }));
      addLog(`💕 RELATION : ${relType === 'Petit(e) ami(e)' ? 'Tu es maintenant en couple !' : 'C\'est devenu ta ' + relType + '.'}`, 'positive');
    } else if (choice.actionType === 'SEPARATE' && choice.partnerId) {
      const relation = gameState.player.relations.find(r => r.id === choice.partnerId);
      if (relation) {
        const isSpouse = relation.isSpouse;
        setGameState(prev => {
          const children = prev.player.relations.filter(r => r.type === 'Enfant');
          let alimony = 0;
          if (children.length > 0 && (relation.isSpouse || relation.livingTogether)) {
            // L'IA décide mais on met une base
            alimony = Math.min(prev.player.stats.money * 0.1, 100000);
          }
          return {
            ...prev,
            player: {
              ...prev.player,
              relations: prev.player.relations.map(r =>
                r.id === choice.partnerId ? { ...r, type: isSpouse ? 'Ex-Conjoint' : 'Ex-Partenaire', isSpouse: false, isPartner: false, livingTogether: false, childSupport: alimony } : r
              )
            }
          };
        });
        addLog(`💔 RUPTURE : Tu t'es séparé de ${relation.name}.`, 'negative');
      }
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
      const partner = gameState.player.relations.find(r => r.id === choice.partnerId);
      const isHorsMariage = partner && !partner.livingTogether && !partner.isSpouse;

      const childName = "Petit(e) " + (partner ? partner.name.split(' ')[0] : gameState.player.name.split(' ')[0]);
      const newChild: Relationship = {
        id: Date.now().toString(),
        name: childName,
        type: 'Enfant',
        level: 100,
        gender: Math.random() > 0.5 ? 'Homme' : 'Femme'
      };

      setGameState(prev => {
        const newRelations = [...prev.player.relations, newChild];
        if (isHorsMariage) {
          return {
            ...prev,
            player: {
              ...prev.player,
              relations: newRelations.map(r => r.id === choice.partnerId ? { ...r, childSupport: (r.childSupport || 0) + 40000 } : r)
            }
          };
        }
        return {
          ...prev,
          player: {
            ...prev.player,
            relations: newRelations
          }
        };
      });
      addLog(`👶 NAISSANCE : Bienvenue à ${childName} ! ${isHorsMariage ? '(Enfant hors mariage - Pension à payer)' : ''}`, 'positive');
    } else if (choice.actionType === 'HOSPITAL_STAY') {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          stats: {
            ...prev.player.stats,
            health: 50,
            stress: 20,
            money: prev.player.stats.money - 150000
          }
        }
      }));
      addLog(`🏥 HÔPITAL : Tu as été soigné. Frais: 150.000 FCFA. Ta santé est revenue à 50%.`, 'neutral');
    }
    
    if (choice.actionType === 'ELECTION_WIN' && choice.office) {
        const salary = choice.office === 'Maire' ? 2500000 : 4500000;
        setGameState(prev => ({
            ...prev,
            player: {
                ...prev.player,
                politicalState: {
                    ...prev.player.politicalState,
                    rank: choice.office,
                    salary: salary,
                    membershipFee: 200000 // Cotisation de haut niveau
                }
            }
        }));
        addLog(`🎊 ÉLECTION : Félicitations ! Tu as été élu ${choice.office} !`, 'positive');
    }

    addLog(choice.resultLog || choice.text, (choice.effect.happiness || 0) < 0 || (choice.effect.health || 0) < 0 ? 'negative' : 'positive');
    setCurrentEvent(null);
  };

  const sleepAction = (e: React.MouseEvent) => {
    updateStats({ stress: -10, health: 5 }, e.clientX, e.clientY);
    addLog("🛌 REPOS : Une bonne sieste ça fait du bien ! Ton stress diminue.", "positive");
  };

  const takeRestActivity = (type: 'Spa' | 'Vacances', e: React.MouseEvent) => {
    const cost = type === 'Spa' ? 50000 : 300000;
    if (gameState.player.stats.money < cost) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }

    if (type === 'Spa') {
      updateStats({ money: -cost, health: 15, stress: -25, happiness: 10 }, e.clientX, e.clientY);
      addLog("🧖 SPA : Un massage à la bougie... Tu es tout neuf !", "positive");
    } else {
      updateStats({ money: -cost, health: 30, stress: -60, happiness: 50 }, e.clientX, e.clientY);
      addLog("🏝️ VACANCES : Un séjour de rêve à Assinie ! Tu es regonflé à bloc.", "positive");
    }
  };

  const quitJob = () => {
    if (window.confirm("Tu es sûr ?")) {
      setGameState(prev => ({ ...prev, player: { ...prev.player, job: null }}));
      addLog("Tu as démissionné.", 'neutral');
    }
  };

  const joinParty = (partyId: string, rank: PoliticalRank) => {
    const party = POLITICAL_PARTIES.find(p => p.id === partyId);
    if (!party) return;

    if (gameState.player.stats.smarts < party.entrySmarts) {
       addLog(`❌ POLITIQUE : Tu n'es pas assez instruit pour rejoindre ${party.name}.`, "negative");
       return;
    }

    const fee = rank === 'Militant' ? 5000 : 50000;
    if (gameState.player.stats.money < fee) {
       addLog(`❌ POLITIQUE : Pas assez d'argent pour l'adhésion.`, "negative");
       return;
    }

    updateStats({ money: -fee });
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        politicalState: {
          partyId: party.id,
          rank: rank,
          membershipFee: fee,
          salary: rank === 'Cadre' ? 100000 : 0
        }
      }
    }));
    addLog(`🚩 POLITIQUE : Tu es maintenant ${rank} au sein du ${party.name} !`, "positive");
  };

  const runCampaign = async (office: 'Maire' | 'Député') => {
    const cost = office === 'Maire' ? 5000000 : 10000000;
    if (gameState.player.stats.money < cost) {
       addLog(`❌ CAMPAGNE : Pas assez de fonds pour la campagne (${cost.toLocaleString()} FCFA).`, "negative");
       return;
    }

    if (!gameState.player.politicalState.partyId) {
        addLog(`❌ CAMPAGNE : Tu dois être membre d'un parti d'abord.`, "negative");
        return;
    }

    setLoading(true);
    const event = await gemini.generateNarrative(gameState, 'random_event', `CAMPAGNE ÉLECTORALE : Le joueur se présente pour devenir ${office}. Coût investi: ${cost.toLocaleString()} FCFA. Il faut un choix pour gagner (WIN) et un pour perdre (FAIL).`);
    if (event) {
        event.choices = event.choices.map((c: any) => ({
            ...c,
            actionType: c.text.toLowerCase().includes('gagn') || c.text.toLowerCase().includes('succès') ? 'ELECTION_WIN' : 'FAIL',
            office
        }));
        setCurrentEvent(event);
        updateStats({ money: -cost });
    }
    setLoading(false);
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

  const isDarkMode = gameState.timer <= 90;

  if (showSplash) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white w-full sm:max-w-md sm:mx-auto relative overflow-hidden">
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

  if (showStartMenu) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white w-full sm:max-w-md sm:mx-auto">
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl mb-6 mx-auto -rotate-6 border-4 border-white/10">
            <i className="fa-solid fa-crown text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Abidjan <span className="text-orange-500 italic">Life</span></h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Prêt pour la suite ?</p>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-orange-600 hover:bg-orange-700 p-6 rounded-[2rem] flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xl shadow-orange-900/20 group"
          >
            <span className="text-xs font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Continuer la partie</span>
            <span className="text-xl font-black">{savePlayerName || "Joueur"}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Es-tu sûr de vouloir effacer ta progression actuelle et recommencer à zéro ?")) {
                handleNewGame();
              }
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 p-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-rotate-right text-slate-500"></i>
            Nouvelle Partie
          </button>
        </div>

        <div className="absolute bottom-12 text-center opacity-30">
          <p className="text-[9px] font-black uppercase tracking-widest">Version 1.0.0</p>
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white w-full sm:max-w-md sm:mx-auto">
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
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Genre</label>
               <select className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl focus:border-orange-600 outline-none font-bold text-sm text-white" value={gameState.player.gender} onChange={e => setGameState(p => ({ ...p, player: { ...p.player, gender: e.target.value as 'Homme' | 'Femme' }}))}>
                 <option value="Homme">Homme</option>
                 <option value="Femme">Femme</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Âge</label>
               <input type="number" min="18" max="30" className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl focus:border-orange-600 outline-none font-bold text-white" value={gameState.player.age} onChange={e => setGameState(p => ({ ...p, player: { ...p.player, age: parseInt(e.target.value) }}))} />
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
    <div className="flex flex-col h-screen bg-slate-50 font-sans w-full sm:max-w-md sm:mx-auto overflow-hidden shadow-2xl relative safe-top">
      {feedbacks.map(f => (
        <div
          key={f.id}
          className={`fixed z-[100] pointer-events-none font-black text-xs uppercase animate-float-up ${f.color}`}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}
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
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="space-y-1 overflow-hidden">
            <h2 className="text-xl md:text-2xl font-black text-white leading-none uppercase tracking-tighter truncate">{gameState.player.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-orange-600 text-[9px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider shrink-0">{gameState.player.age} ANS</span>
              <span className="bg-blue-600 text-[9px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider shrink-0">{MONTHS[gameState.player.month].toUpperCase()}</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[120px]">
                {gameState.player.job ? `${gameState.player.job.title} @ ${gameState.player.job.company.name}` : "Sans emploi"}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl md:text-2xl font-black text-emerald-500 leading-none">{gameState.player.stats.money.toLocaleString()} <small className="text-[10px]">FCFA</small></p>
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

      <div className="flex-1 relative flex flex-col min-h-0 bg-slate-50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        </div>

        {currentEvent && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-h-[90%] overflow-y-auto rounded-[2.5rem] p-8 shadow-2xl animate-elastic">
               <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
               <h3 className="text-orange-600 text-xs font-black uppercase tracking-[0.2em] mb-4">Alerte Babi</h3>
               <p className="text-slate-900 font-bold text-xl leading-snug mb-8 italic">"{currentEvent.description}"</p>
               <div className="space-y-3">
                  {currentEvent.choices.map((c: any, i: number) => (
                    <button key={i} onClick={(e) => handleChoice(c, e)} className="w-full text-left p-5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-100 rounded-2xl text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-4 active:scale-95">
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

      <div className={`bg-white border-t-2 border-slate-100 transition-all duration-300 ${activeTab === 'vie' ? 'p-4 min-h-[160px] shrink-0' : 'fixed inset-0 z-[60] flex flex-col bg-slate-50'}`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Le temps défile à Babi...</p>
          </div>
        ) : (
          <div className="h-full flex flex-col overflow-hidden">
            {activeTab !== 'vie' && (
              <div className="flex justify-between items-center p-6 bg-white border-b border-slate-100 shrink-0 safe-top shadow-sm">
                <h3 className="text-slate-900 text-sm font-black uppercase tracking-[0.2em]">
                  {activeTab === 'travail' ? 'Marché du Travail' :
                   activeTab === 'social' ? 'Relations & Réseau' :
                   activeTab === 'activites' ? 'Activités & Sorties' :
                   activeTab === 'patrimoine' ? 'Banque & Patrimoine' :
                   activeTab === 'boutique' ? 'Boutique' :
                   activeTab === 'smartphone' ? 'Smartphone' :
                   activeTab === 'smartphone_app' ? (selectedApp === 'bank' ? 'Banque Mobile' : selectedApp === 'business' ? 'Gestion Business' : selectedApp === 'politics' ? 'Vie Politique' : 'Babi Love') : ''}
                </h3>
                <button
                  onClick={() => setActiveTab('vie')}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-all shadow-sm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
            <div className={`flex-1 ${activeTab !== 'vie' && activeTab !== 'smartphone' && activeTab !== 'smartphone_app' ? 'overflow-y-auto p-4 pb-20' : 'relative'}`}>
            {activeTab === 'vie' && (
              <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2">
                <button
                  onClick={() => {
                    handleNextStep();
                    setGameState(prev => ({ ...prev, timer: 180 }));
                  }}
                  className="flex-none w-[75%] bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-xl shadow-orange-600/20 flex flex-col items-center justify-center gap-2 p-4 transition-all active:scale-95 group"
                >
                  <i className={`fa-solid ${gameState.player.job ? 'fa-briefcase' : 'fa-play'} text-2xl group-hover:scale-110 transition-transform`}></i>
                  <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Cycle Mensuel ({Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')})</span>
                    <span className="block text-xl font-black italic">{gameState.player.job ? "TRAVAILLER" : "VIVRE LE MOIS"}</span>
                  </div>
                </button>
                <button
                  onClick={(e) => sleepAction(e)}
                  className="flex-none w-[50%] bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-bed text-2xl"></i>
                  <span>Dormir (Réduit Stress)</span>
                </button>
              </div>
            )}

            {activeTab === 'travail' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center px-1">
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ton Emploi Actuel</p>
                   {gameState.player.job && (
                     <button onClick={quitJob} className="text-[9px] font-black text-rose-500 uppercase border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-all active:scale-90">Démissionner</button>
                   )}
                </div>
                <div className="space-y-8">
                  {gameState.player.job && (
                    <div className="p-8 bg-white border-2 border-emerald-100 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm mx-1">
                       <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4">
                        <i className="fa-solid fa-briefcase text-emerald-500 text-3xl"></i>
                       </div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">{gameState.player.job.company.name}</p>
                       <p className="text-xl font-black text-emerald-950 uppercase">{gameState.player.job.title}</p>
                       <div className="h-px w-12 bg-emerald-200 my-4"></div>
                       <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{gameState.player.job.salary.toLocaleString()} FCFA / MOIS</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {!gameState.player.job && <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest py-4">Offres Disponibles</p>}
                    {Array.from(new Set(JOBS.map(j => j.category))).map(cat => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-orange-500 pl-2 ml-1">{cat}</h4>
                        <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                          {JOBS.filter(j => j.category === cat).map((j, i) => (
                            <button key={i} onClick={() => applyForJob(j)} className="flex-none w-[260px] flex flex-col justify-between p-4 bg-white rounded-2xl border-2 transition-all text-left border-slate-100 hover:border-blue-500 active:scale-95 group shadow-sm">
                               <div className="flex flex-col mb-4">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{j.company.name}</p>
                                 <p className="text-sm font-black text-slate-900 leading-tight">{j.title}</p>
                                 <div className="flex gap-2 mt-2">
                                    {j.requiredDegree && <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{j.requiredDegree}</span>}
                                    {j.requiredSpecialty && <span className="text-[8px] font-bold bg-blue-50 px-1.5 py-0.5 rounded text-blue-500">{j.requiredSpecialty}</span>}
                                 </div>
                               </div>
                               <div className="border-t border-slate-50 pt-3">
                                 <p className="text-xs font-black text-emerald-600">{j.salary.toLocaleString()} <small>FCFA</small></p>
                               </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
               <div className="space-y-4 pb-10 animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Tes Relations</h3>
                    <div className="flex gap-2">
                      <button onClick={findNewFriend} className="text-[8px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-full uppercase">Frangin</button>
                      <button onClick={findNewRelation} className="text-[8px] font-black bg-orange-600 text-white px-3 py-1.5 rounded-full uppercase">Love</button>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
                    {gameState.player.relations.map(rel => (
                      <div key={rel.id} className="flex-none w-[280px] bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col gap-3">
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

                            {rel.type !== 'Enfant' && (
                               <button onClick={() => socialInteract(rel.id, 'chat')} className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 py-2 rounded-lg col-span-2">Action Spéciale (IA)</button>
                            )}

                            {rel.level >= 40 && !['Enfant', 'Famille', 'Conjoint', 'Petit(e) ami(e)', 'Maîtresse', 'Amant', 'Amour'].includes(rel.type) && rel.gender !== gameState.player.gender && (
                               <button onClick={() => socialInteract(rel.id, 'flirt')} className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 py-2 rounded-lg">Draguer</button>
                            )}
                            {rel.level >= 60 && ['Ami', 'Amour'].includes(rel.type) && rel.gender !== gameState.player.gender && (
                               <button onClick={() => socialInteract(rel.id, 'become_partner')} className="text-[8px] font-black uppercase text-pink-600 bg-pink-50 py-2 rounded-lg text-center leading-tight">
                                 Demander {rel.gender === 'Femme' ? 'Petite Amie' : 'Petit Ami'}
                               </button>
                            )}
                            {rel.level > 70 && ['Petit(e) ami(e)', 'Maîtresse', 'Amant', 'Amour'].includes(rel.type) && !rel.livingTogether && (
                               <button onClick={() => socialInteract(rel.id, 'cohabit')} className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 py-2 rounded-lg">Vivre ensemble</button>
                            )}
                            {rel.level > 85 && ['Petit(e) ami(e)', 'Maîtresse', 'Amant', 'Amour'].includes(rel.type) && !rel.isSpouse && (
                               <button onClick={() => socialInteract(rel.id, 'marry')} className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 py-2 rounded-lg">Mariage</button>
                            )}
                            {(rel.isSpouse || rel.livingTogether || rel.type === 'Maîtresse' || rel.type === 'Amant') && rel.type !== 'Enfant' && (
                               <button onClick={() => socialInteract(rel.id, 'child')} className="text-[8px] font-black uppercase text-sky-600 bg-sky-50 py-2 rounded-lg">Faire un Enfant</button>
                            )}
                            {['Petit(e) ami(e)', 'Conjoint', 'Maîtresse', 'Amant'].includes(rel.type) && (
                               <button onClick={() => socialInteract(rel.id, 'separate')} className="text-[8px] font-black uppercase text-slate-600 bg-slate-100 py-2 rounded-lg col-span-2">
                                 {rel.type === 'Conjoint' ? 'Divorcer' : 'Se Séparer'}
                               </button>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {activeTab === 'activites' && (
               <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2 animate-in slide-in-from-right duration-300">
                 <button onClick={() => setActiveTab('boutique')} className="flex-none w-24 flex flex-col items-center justify-center p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-shop text-orange-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Boutique</span>
                 </button>
                 <button onClick={goToMall} className="flex-none w-24 flex flex-col items-center justify-center p-4 bg-fuchsia-50 rounded-2xl border-2 border-fuchsia-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-bag-shopping text-fuchsia-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Mall</span>
                 </button>
                 <button onClick={() => setSelectedPropertyId('education')} className="flex-none w-24 flex flex-col items-center justify-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-graduation-cap text-blue-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Études</span>
                 </button>
                 {[
                   { label: 'Spa', icon: 'fa-spa', color: 'text-teal-500', action: (e: any) => takeRestActivity('Spa', e) },
                   { label: 'Vacances', icon: 'fa-umbrella-beach', color: 'text-blue-500', action: (e: any) => takeRestActivity('Vacances', e) },
                   { label: 'Maquis', icon: 'fa-beer-mug-empty', color: 'text-amber-500', ctx: 'Activity: Maquis' },
                   { label: 'Gym', icon: 'fa-dumbbell', color: 'text-rose-500', ctx: 'Activity: Gym' },
                   { label: 'Clinique', icon: 'fa-hospital', color: 'text-emerald-500', ctx: 'Activity: Hospital' },
                   { label: 'Église', icon: 'fa-hands-praying', color: 'text-indigo-500', ctx: 'Activity: Church' }
                 ].map(act => (
                   act.action ? (
                     <button key={act.label} onClick={(e) => act.action(e)} className="flex-none w-24 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 active:scale-95 transition-all">
                       <i className={`fa-solid ${act.icon} ${act.color} text-2xl mb-1`}></i>
                       <span className="text-[10px] font-black uppercase text-slate-900 text-center">{act.label}</span>
                     </button>
                   ) : (
                    <button key={act.label} onClick={async () => { setLoading(true); const ev = await gemini.generateNarrative(gameState, 'activity', act.ctx); if(ev) setCurrentEvent(ev); setLoading(false); }} className="flex-none w-24 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 active:scale-95 transition-all">
                      <i className={`fa-solid ${act.icon} ${act.color} text-2xl mb-1`}></i>
                      <span className="text-[10px] font-black uppercase text-slate-900 text-center">{act.label}</span>
                    </button>
                   )
                 ))}
               </div>
            )}

            {activeTab === 'boutique' && (
              <div className="space-y-4 pb-10">
                <div className="flex items-center gap-2 px-1">
                  <button onClick={() => setActiveTab('activites')} className="text-slate-400"><i className="fa-solid fa-arrow-left"></i></button>
                  <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Boutique Babi</h3>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase px-1">Téléphones & Gadgets</p>
                     <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                       <button onClick={(e) => buyItem({name: "Smartphone Android", price: 120000, type: "Phone"}, e)} className="flex-none w-[200px] flex flex-col justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-start gap-4">
                          <span className="text-sm font-bold">Smartphone Android</span>
                          <span className="text-xs font-black text-emerald-600">120.000 FCFA</span>
                       </button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase px-1">Cadeaux</p>
                     <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                       {GIFTS.map(g => (
                         <button key={g.id} onClick={(e) => buyItem({name: g.name, price: g.price, type: "Gift"}, e)} className="flex-none w-[180px] flex flex-col justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-start gap-4">
                            <span className="text-sm font-bold leading-tight">{g.name}</span>
                            <span className="text-xs font-black text-emerald-600">{g.price.toLocaleString()} FCFA</span>
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="space-y-6">
                     <p className="text-[9px] font-black text-slate-400 uppercase px-1">Concessionnaires & Véhicules</p>

                     {Array.from(new Set(VEHICLES.map(v => v.dealership))).map(dealer => (
                       <div key={dealer} className="space-y-2">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-orange-500 pl-2 ml-1">{dealer}</h4>
                          <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                            {VEHICLES.filter(v => v.dealership === dealer).map(v => (
                              <button key={v.id} onClick={(e) => buyVehicle(v, e)} className="flex-none w-[220px] flex flex-col justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl items-start gap-4 shadow-sm active:scale-95 transition-all">
                                 <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{v.brand}</p>
                                   <span className="text-sm font-black block leading-tight">{v.name}</span>
                                   <span className="text-[8px] uppercase text-orange-500 font-bold">Prestige: +{v.prestige}</span>
                                 </div>
                                 <div className="w-full flex justify-between items-center border-t border-slate-50 pt-2">
                                   <span className="text-[8px] uppercase text-slate-400 font-bold">{v.isBusiness ? 'Business' : 'Privé'}</span>
                                   <span className="text-xs font-black text-emerald-600">{v.price.toLocaleString()} <small>FCFA</small></span>
                                 </div>
                              </button>
                            ))}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'smartphone' && (
               <div className={`absolute inset-0 ${gameState.player.settings?.wallpaper || WALLPAPERS[0]} p-6 flex flex-col animate-in fade-in duration-500`}>
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-10 px-4 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-white/90">Orange-CI</span>
                      <i className="fa-solid fa-wifi text-[10px] text-white/80"></i>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-signal text-[10px] text-white/80"></i>
                      <i className="fa-solid fa-battery-three-quarters text-[12px] text-white/80"></i>
                      <span className="text-[11px] font-black text-white/90">
                        {Math.floor(gameState.timer / 60) + 12}:{(gameState.timer % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* App Grid */}
                  <div className="grid grid-cols-4 gap-y-8 px-2">
                     {[
                       { id: 'bank', icon: 'fa-building-columns', label: 'Banque', color: 'bg-emerald-500' },
                       { id: 'business', icon: 'fa-chart-line', label: 'Business', color: 'bg-blue-600' },
                       { id: 'dating', icon: 'fa-heart', label: 'Love', color: 'bg-rose-500' },
                       { id: 'politics', icon: 'fa-flag', label: 'Politique', color: 'bg-orange-600' },
                       { id: 'settings', icon: 'fa-gear', label: 'Paramètres', color: 'bg-slate-600' }
                     ].map(app => (
                       <button
                        key={app.id}
                        onClick={() => { setSelectedApp(app.id as any); setActiveTab('smartphone_app'); }}
                        className="flex flex-col items-center gap-2 group transition-all active:scale-90"
                       >
                          <div className={`w-14 h-14 ${app.color} rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:brightness-110 transition-all border border-white/10`}>
                            <i className={`fa-solid ${app.icon} text-white text-xl`}></i>
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-tighter drop-shadow-md">{app.label}</span>
                       </button>
                     ))}
                  </div>

                  {/* Android Nav Bar */}
                  <div className="mt-auto flex justify-around items-center pb-8 pt-4 border-t border-white/10 bg-black/10 backdrop-blur-sm -mx-6 px-6">
                     <button onClick={() => setActiveTab('vie')} className="text-white/60 hover:text-white transition-colors">
                        <i className="fa-solid fa-chevron-left text-lg"></i>
                     </button>
                     <button onClick={() => setActiveTab('vie')} className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <i className="fa-solid fa-house text-sm"></i>
                     </button>
                     <button className="text-white/60">
                        <i className="fa-solid fa-square text-lg"></i>
                     </button>
                  </div>
               </div>
            )}

            {activeTab === 'smartphone_app' && (
               <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} p-6 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300`}>
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveTab('smartphone')} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><i className="fa-solid fa-chevron-left text-lg"></i></button>
                    <h3 className="text-sm font-black uppercase tracking-widest">
                        {selectedApp === 'bank' ? 'BABI BANK' :
                         selectedApp === 'business' ? 'BABI BIZ' :
                         selectedApp === 'politics' ? 'BABI POLITIS' :
                         selectedApp === 'settings' ? 'PARAMÈTRES' :
                         'BABI LOVE'}
                    </h3>
                    <div className="w-4"></div>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {selectedApp === 'settings' && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Fond d'écran</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {WALLPAPERS.map((wp, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setGameState(prev => ({
                                                ...prev,
                                                player: {
                                                    ...prev.player,
                                                    settings: { ...prev.player.settings, wallpaper: wp }
                                                }
                                            }))}
                                            className={`h-24 rounded-2xl ${wp} border-4 transition-all ${gameState.player.settings?.wallpaper === wp ? 'border-orange-500 scale-105 shadow-lg' : 'border-transparent opacity-70'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Thème Adaptatif</p>
                                <div className={`p-4 rounded-2xl flex items-center justify-between ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fa-solid ${isDarkMode ? 'fa-moon text-blue-400' : 'fa-sun text-orange-400'} text-xl`}></i>
                                        <span className="text-xs font-black uppercase tracking-wider">{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
                                    </div>
                                    <span className="text-[10px] font-bold opacity-50 uppercase">{Math.floor(gameState.timer / 60) + 12}:{(gameState.timer % 60).toString().padStart(2, '0')}</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 italic">Le thème change automatiquement selon l'heure de la journée (timer).</p>
                            </div>
                        </div>
                    )}
                    {selectedApp === 'politics' && (
                       <div className="space-y-6">
                          {!gameState.player.politicalState.partyId ? (
                            <div className="space-y-4">
                               <div className="p-6 bg-orange-50 rounded-3xl text-center">
                                  <i className="fa-solid fa-bullhorn text-orange-600 text-3xl mb-2"></i>
                                  <p className="text-sm font-bold text-orange-900 italic">"Engage-toi pour construire le pays !"</p>
                               </div>
                               <p className="text-[10px] font-black text-slate-400 uppercase px-1">Choisir un parti</p>
                               <div className="space-y-3">
                                  {POLITICAL_PARTIES.map(party => (
                                    <div key={party.id} className={`p-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border-2 rounded-2xl flex justify-between items-center shadow-sm`}>
                                       <div>
                                          <p className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{party.name}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase">{party.ideology}</p>
                                          <p className="text-[8px] text-orange-600 font-black uppercase mt-1">Smart Min: {party.entrySmarts}</p>
                                       </div>
                                       <div className="flex flex-col gap-1">
                                          <button onClick={() => joinParty(party.id, 'Militant')} className="text-[8px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase">Militant (5k)</button>
                                          <button onClick={() => joinParty(party.id, 'Cadre')} className="text-[8px] font-black bg-orange-600 text-white px-3 py-1 rounded-lg uppercase">Cadre (50k)</button>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                               <div className={`p-6 ${POLITICAL_PARTIES.find(p => p.id === gameState.player.politicalState.partyId)?.color} rounded-3xl text-white`}>
                                  <p className="text-[10px] font-bold uppercase opacity-70 mb-1">{POLITICAL_PARTIES.find(p => p.id === gameState.player.politicalState.partyId)?.name}</p>
                                  <p className="text-2xl font-black uppercase">{gameState.player.politicalState.rank}</p>
                                  {gameState.player.politicalState.salary > 0 && <p className="text-xs font-bold mt-2">Revenus: +{gameState.player.politicalState.salary.toLocaleString()} FCFA/mois</p>}
                               </div>

                               <div className="grid grid-cols-2 gap-3">
                                  <div className={`p-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} rounded-2xl border`}>
                                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Cotisation</p>
                                     <p className="text-sm font-black">-{gameState.player.politicalState.membershipFee.toLocaleString()} <small>FCFA/m</small></p>
                                  </div>
                                  <div className={`p-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} rounded-2xl border`}>
                                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Prestige</p>
                                     <p className="text-sm font-black">+{gameState.player.politicalState.rank === 'Maire' ? 50 : gameState.player.politicalState.rank === 'Député' ? 70 : 10}</p>
                                  </div>
                               </div>

                               {(gameState.player.politicalState.rank === 'Cadre' || gameState.player.politicalState.rank === 'Maire' || gameState.player.politicalState.rank === 'Député') && (
                                 <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase px-1">Élections & Campagnes</p>
                                    <div className="space-y-3">
                                       <button onClick={() => runCampaign('Maire')} className="w-full bg-blue-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg active:scale-95 transition-all">
                                          <div className="text-left">
                                             <p className="font-black text-sm uppercase">Candidat à la Mairie</p>
                                             <p className="text-[9px] font-bold opacity-80 uppercase">Coût: 5.000.000 FCFA</p>
                                          </div>
                                          <i className="fa-solid fa-landmark text-xl opacity-50"></i>
                                       </button>
                                       <button onClick={() => runCampaign('Député')} className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg active:scale-95 transition-all">
                                          <div className="text-left">
                                             <p className="font-black text-sm uppercase">Candidat aux Législatives</p>
                                             <p className="text-[9px] font-bold opacity-80 uppercase">Coût: 10.000.000 FCFA</p>
                                          </div>
                                          <i className="fa-solid fa-gavel text-xl opacity-50"></i>
                                       </button>
                                    </div>
                                 </div>
                               )}

                               <button
                                 onClick={() => setGameState(p => ({ ...p, player: { ...p.player, politicalState: { partyId: null, rank: null, membershipFee: 0, salary: 0 } } }))}
                                 className="w-full text-[9px] font-black text-rose-500 uppercase py-4 border-2 border-rose-100 rounded-2xl hover:bg-rose-50 transition-all"
                               >
                                 Quitter le Parti
                               </button>
                            </div>
                          )}
                       </div>
                    )}
                    {selectedApp === 'bank' && (
                      <div className="space-y-6">
                         <div className={`p-6 ${isDarkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-slate-900'} rounded-3xl text-white flex justify-between items-center shadow-xl`}>
                            <div>
                              <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Solde Total</p>
                              <p className="text-2xl font-black">{gameState.player.stats.money.toLocaleString()} FCFA</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Score Crédit</p>
                              <p className="text-xl font-black text-orange-500">{gameState.player.creditScore}</p>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase px-1">Demander un prêt</p>
                            <div className="space-y-3">
                               {gameState.banks.map(bank => (
                                 <div key={bank.id} className="p-4 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-start">
                                       <div>
                                          <p className="font-black text-slate-900">{bank.name}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase">Intérêt: {(bank.interestRate * 100).toFixed(0)}% • Min Salaire: {bank.minSalary.toLocaleString()}</p>
                                          {bank.requireCDI && <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">CDI Requis</span>}
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[8px] font-black text-slate-400 uppercase">Score Min</p>
                                          <p className="text-xs font-black">{bank.minCreditScore}</p>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                       <button onClick={() => takeLoan(bank.id, 500000, 12)} className="text-[9px] font-black bg-slate-900 text-white py-2 rounded-xl active:scale-95 transition-all">500k (12 mois)</button>
                                       <button onClick={() => takeLoan(bank.id, 2000000, 24)} className="text-[9px] font-black bg-slate-900 text-white py-2 rounded-xl active:scale-95 transition-all">2M (24 mois)</button>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase px-1">Emprunts en cours</p>
                            <div className="space-y-2 px-1">
                              {gameState.player.loans.map(l => (
                                <div key={l.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                                   <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase">{gameState.banks.find(b => b.id === l.bankId)?.name || 'Banque'}</p>
                                      <p className="text-xs font-bold">{l.remainingAmount.toLocaleString()} FCFA restant</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[9px] text-orange-600 font-black">{l.monthsRemaining} mois</p>
                                      <p className="text-[9px] text-slate-400 font-bold">{l.monthlyPayment.toLocaleString()}/m</p>
                                   </div>
                                </div>
                              ))}
                              {gameState.player.loans.length === 0 && <p className="text-[10px] text-slate-400 italic">Aucun prêt actif.</p>}
                            </div>
                         </div>
                      </div>
                    )}

                    {selectedApp === 'business' && (
                      <div className="space-y-4">
                         <div className="flex flex-row gap-2 mb-4 overflow-x-auto no-scrollbar border-b border-slate-100 pb-2">
                            {[
                              {id: 'mine', label: 'Mes Biz'},
                              {id: 'launch', label: 'Lancer'},
                              {id: 'market', label: 'Racheter'},
                              {id: 'invest', label: 'Placements'}
                            ].map(t => (
                              <button
                                key={t.id}
                                onClick={() => setBusinessTab(t.id as any)}
                                className={`flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${businessTab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                              >
                                {t.label}
                              </button>
                            ))}
                         </div>

                         {businessTab === 'mine' && (
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-400 uppercase px-1">Tes Actifs ({gameState.player.businesses.length})</p>
                              <div className="space-y-3">
                                {gameState.player.businesses.map(b => (
                                  <div key={b.id} className="p-4 bg-white rounded-2xl border-2 border-slate-100 flex justify-between items-center shadow-sm">
                                     <div>
                                        <p className="font-black text-slate-900 leading-tight">{b.name}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">{b.type} • {b.location} • Niv.{b.level}</p>
                                        <p className="text-xs font-black text-emerald-600 mt-1">+{b.monthlyRevenue.toLocaleString()} FCFA/mois</p>
                                     </div>
                                     <button
                                      onClick={(e) => expandBusiness(b.id, e)}
                                      className="flex flex-col items-center bg-blue-50 text-blue-600 px-3 py-2 rounded-xl active:scale-90 transition-all group"
                                     >
                                       <i className="fa-solid fa-arrow-up-right-dots text-xs"></i>
                                       <span className="text-[7px] font-black mt-1 uppercase">{(Math.round(b.investment * 0.5 * b.level)).toLocaleString()}</span>
                                     </button>
                                  </div>
                                ))}
                                {gameState.player.businesses.length === 0 && <p className="text-center text-slate-400 py-10 italic text-[10px] uppercase font-bold">Aucun business actif.</p>}
                              </div>
                           </div>
                         )}

                         {businessTab === 'launch' && (
                           <div className="space-y-6">
                              <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase px-1">Choisir un type de business</p>
                                <div className="grid grid-cols-2 gap-3">
                                  {Object.keys(BUSINESS_CONFIG).map(type => (
                                    <div key={type} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                                       <p className="font-black text-xs text-slate-900">{type}</p>
                                       <select
                                        className="w-full bg-white border-none p-2 rounded-lg text-[9px] font-black uppercase"
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            launchBusiness(type, e.target.value);
                                            setBusinessTab('mine');
                                          }
                                        }}
                                        defaultValue=""
                                       >
                                         <option value="" disabled>Quartier ?</option>
                                         {NEIGHBORHOODS.map(n => (
                                           <option key={n.name} value={n.name}>{n.name}</option>
                                         ))}
                                       </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                           </div>
                         )}

                         {businessTab === 'market' && (
                           <div className="space-y-4">
                              <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Opportunités ce mois</p>
                                <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase">Nouveau</span>
                              </div>
                              <div className="space-y-3">
                                {gameState.marketBusinesses.map(b => (
                                  <div key={b.id} className="p-4 bg-white border-2 border-orange-100 rounded-2xl flex justify-between items-center shadow-sm">
                                     <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-black text-slate-900 truncate max-w-[150px]">{b.name}</p>
                                          <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase">Niv.{b.level}</span>
                                        </div>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">{b.location}</p>
                                        <p className="text-xs font-black text-emerald-600 mt-1">+{b.monthlyRevenue.toLocaleString()} FCFA/mois</p>
                                     </div>
                                     <button
                                      onClick={(e) => buyMarketBusiness(b, e)}
                                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all"
                                     >
                                       {b.investment.toLocaleString()}
                                     </button>
                                  </div>
                                ))}
                              </div>
                           </div>
                         )}

                         {businessTab === 'invest' && (
                            <div className="space-y-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase px-1">Placements Financiers</p>
                               <div className="space-y-3">
                                  {[
                                    {type: 'SAVINGS', label: 'Compte Épargne', icon: 'fa-piggy-bank', desc: 'Sûr, intérêts 0.5%/mois', color: 'bg-emerald-50 text-emerald-600'},
                                    {type: 'STOCK', label: 'Bourse Abidjan', icon: 'fa-chart-line', desc: 'Risqué, ~1.5%/mois', color: 'bg-blue-50 text-blue-600'},
                                    {type: 'REAL_ESTATE', label: 'Immobilier Locatif', icon: 'fa-building', desc: 'Stable, loyers ~0.8%/mois', color: 'bg-indigo-50 text-indigo-600'}
                                  ].map(inv => (
                                    <div key={inv.type} className="p-4 bg-white rounded-2xl border-2 border-slate-100 space-y-3 shadow-sm">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 ${inv.color} rounded-xl flex items-center justify-center`}><i className={`fa-solid ${inv.icon}`}></i></div>
                                          <div>
                                             <p className="font-black text-slate-900 text-sm">{inv.label}</p>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase">{inv.desc}</p>
                                          </div>
                                       </div>
                                       <div className="flex gap-2">
                                          {[100000, 500000, 1000000].map(amt => (
                                            <button
                                              key={amt}
                                              onClick={(e) => investMoney(inv.type as any, amt, e)}
                                              className={`flex-1 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'} hover:opacity-80 py-2 rounded-lg text-[9px] font-black transition-all active:scale-95`}
                                            >
                                              {amt >= 1000000 ? (amt/1000000)+'M' : (amt/1000)+'k'}
                                            </button>
                                          ))}
                                       </div>
                                    </div>
                                  ))}
                               </div>

                               {gameState.player.investments.length > 0 && (
                                 <div className="space-y-3">
                                   <p className="text-[10px] font-black text-slate-400 uppercase px-1">Tes Placements Actifs</p>
                                   <div className="space-y-2">
                                     {gameState.player.investments.map(inv => (
                                       <div key={inv.id} className="p-3 bg-slate-900 rounded-xl text-white flex justify-between items-center">
                                          <div>
                                             <p className="text-[10px] font-black uppercase opacity-60">{inv.name}</p>
                                             <p className="text-xs font-bold">{inv.currentValue.toLocaleString()} FCFA</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-[8px] font-black text-emerald-400 uppercase">+{Math.round(inv.currentValue * inv.monthlyYield).toLocaleString()} FCFA/m</p>
                                          </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}
                            </div>
                         )}
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
              <div className="space-y-6 pb-10 animate-in slide-in-from-right duration-300">
                <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest px-1">Patrimoine & Business</h3>

                {/* Propriétés */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Immobilier</p>
                     <button onClick={() => setSelectedPropertyId('new')} className="text-[8px] font-black bg-blue-600 text-white px-2 py-1 rounded">Acheter/Louer</button>
                   </div>
                   <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                     {gameState.player.assets.properties.map(p => (
                       <div key={p.id} className="flex-none w-[260px] p-4 bg-white border-2 border-slate-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-black">{p.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-bold leading-tight">{p.location} - {p.type === 'OWN' ? 'Propriétaire' : 'Locataire'}</p>
                            </div>
                            <button onClick={() => setSelectedPropertyId(p.id)} className="text-[9px] font-black text-orange-600 uppercase">Meubler</button>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {p.furnishings.length === 0 && <span className="text-[8px] text-slate-400 uppercase">Vide</span>}
                            {p.furnishings.map((f, i) => (
                              <span key={i} className="text-[8px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">{f.name}</span>
                            ))}
                          </div>
                       </div>
                     ))}
                     {gameState.player.assets.properties.length === 0 && (
                       <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl w-full text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Aucune propriété</p>
                       </div>
                     )}
                   </div>
                </div>

                {/* Businesses */}
                <div className="space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mes Business</p>
                   <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                     {gameState.player.businesses.map(b => (
                       <div key={b.id} className="flex-none w-[240px] p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex flex-col gap-2">
                          <div>
                            <p className="text-sm font-black text-emerald-900">{b.name}</p>
                            <p className="text-[9px] text-emerald-600 uppercase font-bold">{b.type} • {b.location} • Niv.{b.level}</p>
                          </div>
                          <p className="text-xs font-black text-emerald-700">+{b.monthlyRevenue.toLocaleString()} FCFA/mois</p>
                       </div>
                     ))}
                     {gameState.player.businesses.length === 0 && (
                       <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl w-full text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Aucun business actif</p>
                       </div>
                     )}
                   </div>
                </div>

                {/* Placements */}
                {gameState.player.investments.length > 0 && (
                   <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Placements Financiers</p>
                      <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar px-1">
                        {gameState.player.investments.map(inv => (
                          <div key={inv.id} className="flex-none w-[200px] p-4 bg-slate-900 rounded-2xl text-white">
                             <p className="text-[10px] font-black uppercase opacity-60">{inv.name}</p>
                             <p className="text-sm font-bold">{inv.currentValue.toLocaleString()} FCFA</p>
                             <p className="text-[9px] font-black text-emerald-400 uppercase mt-2">+{Math.round(inv.currentValue * inv.monthlyYield).toLocaleString()} FCFA/m</p>
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {/* Banque */}
                <div className="space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Services Bancaires</p>
                   <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl flex justify-between items-center shadow-sm mx-1">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Score de Crédit</p>
                        <p className="text-xl font-black text-orange-600">{gameState.player.creditScore}</p>
                      </div>
                      <button onClick={() => { setSelectedApp('bank'); setActiveTab('smartphone_app'); }} className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl">Ouvrir l'App Banque</button>
                   </div>
                </div>

              </div>
            )}

            {/* Modal Achat Maison / Meubler / Etudes */}
            {selectedPropertyId && (
              <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 overflow-y-auto max-h-[85vh] animate-elastic shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                     <h4 className="text-sm font-black uppercase tracking-widest">
                       {selectedPropertyId === 'new' ? 'Nouveau Logement' :
                        selectedPropertyId === 'education' ? 'Centre de Formation' :
                        'Acheter des Meubles'}
                     </h4>
                     <button onClick={() => setSelectedPropertyId(null)}><i className="fa-solid fa-xmark text-slate-400"></i></button>
                   </div>

                   {selectedPropertyId === 'education' ? (
                      <div className="space-y-6">
                        {gameState.player.educationState.currentDegree ? (
                          <div className="p-6 bg-blue-50 rounded-3xl text-center space-y-4 border-2 border-blue-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                              <i className="fa-solid fa-graduation-cap text-blue-500 text-xl"></i>
                            </div>
                            <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Études en cours</p>
                            <p className="text-xl font-black text-blue-600">{gameState.player.educationState.currentDegree} en {gameState.player.educationState.specialty}</p>
                            <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden">
                               <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${(gameState.player.educationState.monthsCompleted / (gameState.player.educationState.currentDegree === 'BTS' ? 3 : (gameState.player.educationState.currentDegree === 'Certification' ? 2 : 6))) * 100}%` }}></div>
                            </div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase">
                              {gameState.player.educationState.monthsCompleted} / {gameState.player.educationState.currentDegree === 'BTS' ? 3 : (gameState.player.educationState.currentDegree === 'Certification' ? 2 : 6)} MOIS
                            </p>
                            <p className="text-[9px] font-black text-slate-400 italic">La progression est automatique chaque mois.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase">S'inscrire à une formation</p>
                            <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar pb-2">
                              {[
                                { level: 'Certification', price: 50000, duration: '2 mois' },
                                { level: 'BTS', price: 100000, duration: '3 mois' },
                                { level: 'Licence', price: 200000, duration: '6 mois' },
                                { level: 'Master', price: 500000, duration: '6 mois' },
                                { level: 'Doctorat', price: 1000000, duration: '6 mois' }
                              ].map(d => (
                                <div key={d.level} className="flex-none w-[220px] p-4 border-2 border-slate-100 rounded-2xl space-y-3">
                                  <div className="flex justify-between items-center">
                                    <p className="font-black text-slate-900">{d.level}</p>
                                    <p className="text-xs font-black text-emerald-600">{d.price.toLocaleString()} FCFA</p>
                                  </div>
                                  <select
                                    className="w-full bg-slate-100 border-none p-2 rounded-lg text-[10px] font-black uppercase"
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                                        enrollDegree(d.level as any, e.target.value, { clientX: rect.left, clientY: rect.top } as any);
                                        setSelectedPropertyId(null);
                                      }
                                    }}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>Choisir Spécialité</option>
                                    <option value="Informatique">Informatique</option>
                                    <option value="Droit">Droit</option>
                                    <option value="Ressources Humaines">Ressources Humaines</option>
                                    <option value="Comptabilité">Comptabilité</option>
                                    <option value="Gestion Commerciale">Gestion Commerciale</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Communication">Communication</option>
                                    <option value="Santé">Santé</option>
                                    <option value="Génie Civil">Génie Civil</option>
                                    <option value="Architecture">Architecture</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase">Tes Diplômes</p>
                           <div className="flex flex-wrap gap-2">
                              {gameState.player.educationState.degreesObtained.map(deg => (
                                <span key={deg} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">{deg}</span>
                              ))}
                           </div>
                        </div>
                      </div>
                   ) : selectedPropertyId === 'new' ? (
                     <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar pb-2">
                       {NEIGHBORHOODS.map(n => (
                         <div key={n.name} className="flex-none w-[240px] p-4 border-2 border-slate-100 rounded-2xl space-y-3">
                            <p className="font-black text-slate-900">{n.name} <span className="text-[10px] text-orange-500">Prestige: {n.prestige}</span></p>
                            <div className="grid grid-cols-1 gap-2">
                               <button onClick={(e) => { buyHouse(n, 'RENT', e); setSelectedPropertyId(null); }} className="text-[10px] font-black bg-blue-50 text-blue-600 py-3 rounded-xl">LOUER ({n.rent.toLocaleString()}/m)</button>
                               <button onClick={(e) => { buyHouse(n, 'OWN', e); setSelectedPropertyId(null); }} className="text-[10px] font-black bg-emerald-50 text-emerald-600 py-3 rounded-xl">ACHETER ({n.basePrice.toLocaleString()})</button>
                            </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar pb-2">
                       {FURNITURE_ITEMS.map(f => (
                         <button key={f.id} onClick={(e) => buyFurniture(f, selectedPropertyId, e)} className="flex-none w-[200px] flex flex-col justify-between items-start p-4 border-2 border-slate-100 rounded-2xl gap-4">
                            <div className="text-left">
                              <p className="text-sm font-bold leading-tight">{f.name}</p>
                              <p className="text-[8px] text-emerald-600 font-black uppercase mt-1">Santé +{f.healthBonus}<br/>Bonheur +{f.happinessBonus}</p>
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
