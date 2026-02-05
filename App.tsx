
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
  { id: '9', name: "Sécurité 'Vigilance'", industry: "Services", prestige: 30 },
  { id: '10', name: "Clinique PISAM", industry: "Santé", prestige: 80 },
  { id: '11', name: "PFO Africa", industry: "BTP", prestige: 85 },
  { id: '12', name: "Palais de Justice", industry: "Droit", prestige: 75 }
];

const JOBS: Job[] = [
  // Secteur Informel
  { company: COMPANIES[3], title: "Gérant de Maquis", salary: 85000, stressLevel: 45, requirement: 10, workingHours: "17h - 02h", category: "Secteur Informel" },
  { company: COMPANIES[1], title: "Laveur de Bus", salary: 55000, stressLevel: 65, requirement: 5, workingHours: "05h - 14h", category: "Secteur Informel" },
  { company: COMPANIES[1], title: "Chauffeur de Gbaka", salary: 120000, stressLevel: 85, requirement: 15, workingHours: "04h - 22h", category: "Secteur Informel" },
  { company: COMPANIES[8], title: "Agent de Sécurité", salary: 110000, stressLevel: 40, requirement: 10, workingHours: "19h - 07h", category: "Secteur Informel" },
  { company: COMPANIES[3], title: "Vendeur de Garba", salary: 75000, stressLevel: 50, requirement: 5, workingHours: "07h - 16h", category: "Secteur Informel" },
  { company: COMPANIES[3], title: "Djoutai (Dockeur)", salary: 95000, stressLevel: 90, requirement: 10, workingHours: "06h - 18h", category: "Secteur Informel" },

  // Informatique & Tech
  { company: COMPANIES[5], title: "Technicien Maintenance", salary: 250000, stressLevel: 40, requirement: 40, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Informatique', category: "Informatique & Tech" },
  { company: COMPANIES[5], title: "Développeur Web Junior", salary: 450000, stressLevel: 60, requirement: 60, workingHours: "09h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Informatique', category: "Informatique & Tech" },
  { company: COMPANIES[0], title: "Ingénieur Logiciel", salary: 850000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Informatique', category: "Informatique & Tech" },
  { company: COMPANIES[5], title: "Expert IA / Data Scientist", salary: 1500000, stressLevel: 65, requirement: 95, workingHours: "08h - 18h", requiredDegree: 'Doctorat', requiredSpecialty: 'Informatique', category: "Informatique & Tech" },
  { company: COMPANIES[0], title: "Analyste Cyber-sécurité", salary: 900000, stressLevel: 80, requirement: 85, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Informatique', category: "Informatique & Tech" },

  // Droit & Justice
  { company: COMPANIES[11], title: "Clerc d'Avocat", salary: 200000, stressLevel: 50, requirement: 45, workingHours: "08h - 18h", requiredDegree: 'BTS', requiredSpecialty: 'Droit', category: "Droit & Justice" },
  { company: COMPANIES[8], title: "Assistant Juridique", salary: 350000, stressLevel: 45, requirement: 55, workingHours: "08h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Droit', category: "Droit & Justice" },
  { company: COMPANIES[4], title: "Juriste d'Affaires", salary: 750000, stressLevel: 75, requirement: 85, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Droit', category: "Droit & Justice" },
  { company: COMPANIES[6], title: "Professeur de Droit", salary: 1200000, stressLevel: 50, requirement: 95, workingHours: "08h - 16h", requiredDegree: 'Doctorat', requiredSpecialty: 'Droit', category: "Droit & Justice" },
  { company: COMPANIES[11], title: "Magistrat Junior", salary: 800000, stressLevel: 85, requirement: 90, workingHours: "08h - 17h", requiredDegree: 'Master', requiredSpecialty: 'Droit', category: "Droit & Justice" },

  // Comptabilité & Finance
  { company: COMPANIES[4], title: "Aide Comptable", salary: 180000, stressLevel: 40, requirement: 40, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance" },
  { company: COMPANIES[4], title: "Comptable Junior", salary: 400000, stressLevel: 65, requirement: 65, workingHours: "08h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance" },
  { company: COMPANIES[4], title: "Contrôleur de Gestion", salary: 800000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance" },
  { company: COMPANIES[4], title: "Expert Comptable", salary: 1800000, stressLevel: 85, requirement: 95, workingHours: "08h - 20h", requiredDegree: 'Doctorat', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance" },
  { company: COMPANIES[4], title: "Analyste Financier", salary: 950000, stressLevel: 75, requirement: 85, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Comptabilité', category: "Comptabilité & Finance" },

  // Ressources Humaines
  { company: COMPANIES[0], title: "Gestionnaire de Paie", salary: 280000, stressLevel: 45, requirement: 50, workingHours: "08h - 17h", requiredDegree: 'BTS', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines" },
  { company: COMPANIES[0], title: "Chargé de Recrutement", salary: 380000, stressLevel: 50, requirement: 55, workingHours: "08h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines" },
  { company: COMPANIES[0], title: "Responsable RH", salary: 900000, stressLevel: 70, requirement: 80, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines" },
  { company: COMPANIES[0], title: "Directeur RH", salary: 1600000, stressLevel: 80, requirement: 95, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Ressources Humaines', category: "Ressources Humaines" },

  // Santé
  { company: COMPANIES[9], title: "Aide-Soignant", salary: 150000, stressLevel: 60, requirement: 30, workingHours: "07h - 19h", requiredDegree: 'Certification', requiredSpecialty: 'Santé', category: "Santé" },
  { company: COMPANIES[9], title: "Infirmier d'État", salary: 350000, stressLevel: 70, requirement: 60, workingHours: "07h - 19h", requiredDegree: 'Licence', requiredSpecialty: 'Santé', category: "Santé" },
  { company: COMPANIES[9], title: "Médecin Généraliste", salary: 850000, stressLevel: 80, requirement: 85, workingHours: "08h - 18h (Garde)", requiredDegree: 'Master', requiredSpecialty: 'Santé', category: "Santé" },
  { company: COMPANIES[9], title: "Chirurgien Spécialiste", salary: 2500000, stressLevel: 95, requirement: 98, workingHours: "Irrégulier", requiredDegree: 'Doctorat', requiredSpecialty: 'Santé', category: "Santé" },

  // BTP & Ingénierie
  { company: COMPANIES[10], title: "Chef de Chantier Junior", salary: 400000, stressLevel: 75, requirement: 55, workingHours: "07h - 17h", requiredDegree: 'Licence', requiredSpecialty: 'Génie Civil', category: "BTP & Ingénierie" },
  { company: COMPANIES[10], title: "Ingénieur Structure", salary: 900000, stressLevel: 70, requirement: 85, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Génie Civil', category: "BTP & Ingénierie" },
  { company: COMPANIES[10], title: "Architecte", salary: 1200000, stressLevel: 65, requirement: 90, workingHours: "09h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Architecture', category: "BTP & Ingénierie" },

  // Marketing & Communication
  { company: COMPANIES[7], title: "Graphiste Junior", salary: 220000, stressLevel: 45, requirement: 45, workingHours: "09h - 18h", requiredDegree: 'BTS', requiredSpecialty: 'Communication', category: "Marketing & Communication" },
  { company: COMPANIES[7], title: "Community Manager", salary: 300000, stressLevel: 40, requirement: 50, workingHours: "09h - 18h", requiredDegree: 'Licence', requiredSpecialty: 'Communication', category: "Marketing & Communication" },
  { company: COMPANIES[0], title: "Chef de Produit", salary: 700000, stressLevel: 65, requirement: 75, workingHours: "08h - 18h", requiredDegree: 'Master', requiredSpecialty: 'Marketing', category: "Marketing & Communication" },
  { company: COMPANIES[0], title: "Directeur Marketing", salary: 1800000, stressLevel: 85, requirement: 95, workingHours: "08h - 19h", requiredDegree: 'Master', requiredSpecialty: 'Marketing', category: "Marketing & Communication" }
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
      education: "Baccalauréat",
      educationState: {
        currentDegree: null,
        specialty: null,
        monthsCompleted: 0,
        degreesObtained: ["Baccalauréat"]
      },
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
    
    // Études automatiques
    let eduCompleted = false;
    let completedDegreeName = "";
    const currentEdu = gameState.player.educationState;

    const totalMonthlyLoanPayment = gameState.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    const hasActiveLoans = gameState.player.loans.length > 0;
    
    const businessIncome = gameState.player.businesses.reduce((acc, b) => acc + b.monthlyRevenue, 0);
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

      const netIncome = monthlySalary + businessIncome - totalMonthlyLoanPayment - childExpenses - finalRentExpenses - totalChildSupport;

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

      return {
        ...prev,
        player: {
          ...prev.player,
          age: nextAge,
          month: nextMonthIndex,
          loans: updatedLoans,
          education: completedDegreeName || prev.player.education,
          educationState: newEduState,
          stats: {
            ...prev.player.stats,
            money: prev.player.stats.money + netIncome,
            health: Math.min(100, Math.max(0, prev.player.stats.health + healthBonus - (prev.player.age > 40 && nextMonthIndex === 0 ? 3 : 0) - (isStudyingAndWorking ? 8 : 0))),
            happiness: Math.min(100, prev.player.stats.happiness + happyBonus),
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

    if (event) setCurrentEvent(event);

    // Vérification hospitalisation
    if (gameState.player.stats.health <= 0) {
      triggerHospital();
    }

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

  const enrollDegree = (degree: 'BTS' | 'Licence' | 'Master' | 'Doctorat' | 'Certification', specialty: string) => {
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

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stats: { ...prev.player.stats, money: prev.player.stats.money - fee },
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
    
    addLog(choice.resultLog || choice.text, (choice.effect.happiness || 0) < 0 || (choice.effect.health || 0) < 0 ? 'negative' : 'positive');
    setCurrentEvent(null);
  };

  const sleepAction = () => {
    updateStats({ stress: -10, health: 5 });
    addLog("🛌 REPOS : Une bonne sieste ça fait du bien ! Ton stress diminue.", "positive");
  };

  const takeRestActivity = (type: 'Spa' | 'Vacances') => {
    const cost = type === 'Spa' ? 50000 : 300000;
    if (gameState.player.stats.money < cost) {
      addLog("Pas assez d'argent !", "negative");
      return;
    }

    if (type === 'Spa') {
      updateStats({ money: -cost, health: 15, stress: -25, happiness: 10 });
      addLog("🧖 SPA : Un massage à la bougie... Tu es tout neuf !", "positive");
    } else {
      updateStats({ money: -cost, health: 30, stress: -60, happiness: 50 });
      addLog("🏝️ VACANCES : Un séjour de rêve à Assinie ! Tu es regonflé à bloc.", "positive");
    }
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
              <div className="flex flex-col gap-3 h-full">
                <button
                  onClick={() => {
                    handleNextStep();
                    setGameState(prev => ({ ...prev, timer: 180 }));
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-xl shadow-orange-600/20 flex flex-col items-center justify-center gap-2 p-4 transition-all active:scale-95 group"
                >
                  <i className={`fa-solid ${gameState.player.job ? 'fa-briefcase' : 'fa-play'} text-2xl group-hover:scale-110 transition-transform`}></i>
                  <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Cycle Mensuel ({Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')})</span>
                    <span className="block text-xl font-black italic">{gameState.player.job ? "TRAVAILLER" : "VIVRE LE MOIS"}</span>
                  </div>
                </button>
                <button
                  onClick={sleepAction}
                  className="bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-bed"></i> Dormir (Réduit Stress)
                </button>
              </div>
            )}

            {activeTab === 'travail' && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex justify-between items-center px-1 shrink-0">
                   <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Marché de l'Emploi</h3>
                   {gameState.player.job && (
                     <button onClick={quitJob} className="text-[9px] font-black text-rose-500 uppercase border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-all active:scale-90">Démissionner</button>
                   )}
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                  {gameState.player.job ? (
                    <div className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] flex flex-col items-center text-center shadow-inner">
                       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                        <i className="fa-solid fa-briefcase text-emerald-500 text-3xl"></i>
                       </div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">{gameState.player.job.company.name}</p>
                       <p className="text-xl font-black text-emerald-950 uppercase">{gameState.player.job.title}</p>
                       <div className="h-px w-12 bg-emerald-200 my-4"></div>
                       <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{gameState.player.job.salary.toLocaleString()} FCFA / MOIS</p>
                    </div>
                  ) : (
                    Array.from(new Set(JOBS.map(j => j.category))).map(cat => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-orange-500 pl-2 ml-1">{cat}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {JOBS.filter(j => j.category === cat).map((j, i) => (
                            <button key={i} onClick={() => applyForJob(j)} className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition-all text-left border-slate-100 hover:border-blue-500 active:scale-95 group shadow-sm">
                               <div className="flex flex-col">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{j.company.name}</p>
                                 <p className="text-sm font-black text-slate-900">{j.title}</p>
                                 <div className="flex gap-2 mt-1">
                                    {j.requiredDegree && <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{j.requiredDegree}</span>}
                                    {j.requiredSpecialty && <span className="text-[8px] font-bold bg-blue-50 px-1.5 py-0.5 rounded text-blue-500">{j.requiredSpecialty}</span>}
                                 </div>
                               </div>
                               <div className="text-right flex flex-col items-end">
                                 <p className="text-xs font-black text-emerald-600">{j.salary.toLocaleString()} <small>FCFA</small></p>
                               </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
               <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1 pb-20">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Tes Relations</h3>
                    <div className="flex gap-2">
                      <button onClick={findNewFriend} className="text-[8px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-full uppercase">Frangin</button>
                      <button onClick={findNewRelation} className="text-[8px] font-black bg-orange-600 text-white px-3 py-1.5 rounded-full uppercase">Love</button>
                    </div>
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

                          {rel.type !== 'Enfant' && (
                             <button onClick={() => socialInteract(rel.id, 'chat')} className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 py-2 rounded-lg col-span-2">Action Spéciale (IA)</button>
                          )}

                          {rel.level >= 40 && !['Enfant', 'Famille', 'Conjoint', 'Petit(e) ami(e)', 'Maîtresse', 'Amant', 'Amour'].includes(rel.type) && rel.gender !== gameState.player.gender && (
                             <button onClick={() => socialInteract(rel.id, 'flirt')} className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 py-2 rounded-lg">Draguer</button>
                          )}
                          {rel.level >= 60 && ['Ami', 'Amour'].includes(rel.type) && rel.gender !== gameState.player.gender && (
                             <button onClick={() => socialInteract(rel.id, 'become_partner')} className="text-[8px] font-black uppercase text-pink-600 bg-pink-50 py-2 rounded-lg">
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
                 <button onClick={() => setSelectedPropertyId('education')} className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 active:scale-95 transition-all">
                    <i className="fa-solid fa-graduation-cap text-blue-600 text-2xl mb-1"></i>
                    <span className="text-[10px] font-black uppercase text-slate-900 text-center">Études</span>
                 </button>
                 {[
                   { label: 'Spa', icon: 'fa-spa', color: 'text-teal-500', action: () => takeRestActivity('Spa') },
                   { label: 'Vacances', icon: 'fa-umbrella-beach', color: 'text-blue-500', action: () => takeRestActivity('Vacances') },
                   { label: 'Maquis', icon: 'fa-beer-mug-empty', color: 'text-amber-500', ctx: 'Activity: Maquis' },
                   { label: 'Gym', icon: 'fa-dumbbell', color: 'text-rose-500', ctx: 'Activity: Gym' },
                   { label: 'Clinique', icon: 'fa-hospital', color: 'text-emerald-500', ctx: 'Activity: Hospital' },
                   { label: 'Église', icon: 'fa-hands-praying', color: 'text-indigo-500', ctx: 'Activity: Church' }
                 ].map(act => (
                   act.action ? (
                     <button key={act.label} onClick={act.action} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 active:scale-95 transition-all">
                       <i className={`fa-solid ${act.icon} ${act.color} text-2xl mb-1`}></i>
                       <span className="text-[10px] font-black uppercase text-slate-900 text-center">{act.label}</span>
                     </button>
                   ) : (
                    <button key={act.label} onClick={async () => { setLoading(true); const ev = await gemini.generateNarrative(gameState, 'activity', act.ctx); if(ev) setCurrentEvent(ev); setLoading(false); }} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 active:scale-95 transition-all">
                      <i className={`fa-solid ${act.icon} ${act.color} text-2xl mb-1`}></i>
                      <span className="text-[10px] font-black uppercase text-slate-900 text-center">{act.label}</span>
                    </button>
                   )
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

              </div>
            )}

            {/* Modal Achat Maison / Meubler / Etudes */}
            {selectedPropertyId && (
              <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 overflow-y-auto max-h-[80vh]">
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
                            {[
                              { level: 'Certification', price: 50000, duration: '2 mois' },
                              { level: 'BTS', price: 100000, duration: '3 mois' },
                              { level: 'Licence', price: 200000, duration: '6 mois' },
                              { level: 'Master', price: 500000, duration: '6 mois' },
                              { level: 'Doctorat', price: 1000000, duration: '6 mois' }
                            ].map(d => (
                              <div key={d.level} className="p-4 border-2 border-slate-100 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <p className="font-black text-slate-900">{d.level}</p>
                                  <p className="text-xs font-black text-emerald-600">{d.price.toLocaleString()} FCFA</p>
                                </div>
                                <select
                                  className="w-full bg-slate-100 border-none p-2 rounded-lg text-[10px] font-black uppercase"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      enrollDegree(d.level as any, e.target.value);
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
