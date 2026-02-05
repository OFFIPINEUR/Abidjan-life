
export interface Stats {
  health: number;
  happiness: number;
  smarts: number;
  looks: number;
  stress: number;
  money: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  prestige: number;
}

export interface Job {
  company: Company;
  title: string;
  salary: number;
  stressLevel: number;
  requirement: number; // Smarts needed
  workingHours: string; // Heures de travail
  requiredDegree?: 'BTS' | 'Licence' | 'Master' | 'Doctorat' | 'Certification';
  requiredSpecialty?: string;
  category: string;
}

export interface Loan {
  id: string;
  amount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  durationMonths: number;
  monthsRemaining: number;
}

export interface Furniture {
  id: string;
  name: string;
  price: number;
  healthBonus: number;
  happinessBonus: number;
}

export interface Property {
  id: string;
  name: string;
  location: string; // Neighborhood
  type: 'RENT' | 'OWN';
  price: number;
  monthlyCost: number;
  furnishings: Furniture[];
}

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  prestige: number;
  isBusiness: boolean; // For Gbakas
}

export interface Relationship {
  id: string;
  name: string;
  type: 'Famille' | 'Ami' | 'Amour' | 'Collègue' | 'Conjoint' | 'Enfant';
  level: number;
  gender: 'Homme' | 'Femme';
  isPartner?: boolean;
  isSpouse?: boolean;
  livingTogether?: boolean;
}

export interface LogEntry {
  id: string;
  year: number;
  month?: number;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'event';
}

export interface Business {
  id: string;
  name: string;
  type: 'Gbaka' | 'Boutique' | 'Maquis' | 'Transport';
  investment: number;
  monthlyRevenue: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Phone' | 'Gift';
  value: number;
}

export interface EducationState {
  currentDegree: 'BTS' | 'Licence' | 'Master' | 'Doctorat' | 'Certification' | null;
  specialty: string | null;
  monthsCompleted: number;
  degreesObtained: string[];
}

export interface GameState {
  isRegistered: boolean;
  timer: number;
  player: {
    name: string;
    gender: 'Homme' | 'Femme';
    age: number;
    month: number;
    job: Job | null;
    stats: Stats;
    relations: Relationship[];
    assets: {
      properties: Property[];
      vehicles: Vehicle[];
    };
    loans: Loan[]; // Suivi des emprunts
    logs: LogEntry[];
    education: string;
    educationState: EducationState;
    inventory: InventoryItem[];
    businesses: Business[];
  };
}
