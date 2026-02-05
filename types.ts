
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

export interface Property {
  id: string;
  name: string;
  location: string;
  type: 'RENT' | 'OWN';
  price: number;
  monthlyCost: number;
}

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  prestige: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'Famille' | 'Ami' | 'Amour' | 'Collègue';
  level: number;
}

export interface LogEntry {
  id: string;
  year: number;
  month?: number;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'event';
}

export interface GameState {
  isRegistered: boolean;
  timer: number;
  player: {
    name: string;
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
  };
}
