
export interface Stats {
  health: number;
  happiness: number;
  smarts: number;
  looks: number;
  stress: number;
  money: number;
  reputation: number;
  performance: number;
  networking: number;
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
  isCDI: boolean;
}

export interface Loan {
  id: string;
  bankId: string;
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
  brand: string;
  dealership: string;
  price: number;
  prestige: number;
  isBusiness: boolean; // For Gbakas
}

export interface Relationship {
  id: string;
  name: string;
  type: 'Famille' | 'Ami' | 'Amour' | 'Collègue' | 'Conjoint' | 'Enfant' | 'Petit(e) ami(e)' | 'Amant' | 'Maîtresse' | 'Ex-Conjoint' | 'Ex-Partenaire';
  level: number;
  gender: 'Homme' | 'Femme';
  isPartner?: boolean;
  isSpouse?: boolean;
  livingTogether?: boolean;
  childSupport?: number;
}

export interface LogEntry {
  id: string;
  year: number;
  month?: number;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'event';
}

export type BusinessType = 'Gbaka' | 'Boutique' | 'Maquis' | 'Transport' | 'Kbine' | 'Kiosque' | 'Lavage Auto' | 'Pressing' | 'Garbadrome';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  location: string;
  investment: number;
  monthlyRevenue: number;
  level: number;
}

export interface Investment {
  id: string;
  name: string;
  type: 'SAVINGS' | 'STOCK' | 'REAL_ESTATE';
  initialAmount: number;
  currentValue: number;
  monthlyYield: number; // Yield rate or fixed return
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

export type PoliticalRank = 'Militant' | 'Cadre' | 'Maire' | 'Député';

export interface PoliticalState {
  partyId: string | null;
  rank: PoliticalRank | null;
  membershipFee: number;
  salary: number;
}

export interface Bank {
  id: string;
  name: string;
  interestRate: number;
  minSalary: number;
  requireCDI: boolean;
  minCreditScore: number;
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
    creditScore: number;
    politicalState: PoliticalState;
    logs: LogEntry[];
    education: string;
    educationState: EducationState;
    inventory: InventoryItem[];
    businesses: Business[];
    investments: Investment[];
    jobWarnings: number;
    settings?: {
      wallpaper: string;
    };
  };
  marketBusinesses: Business[];
  banks: Bank[];
}
