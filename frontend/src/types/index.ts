export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  compatibleCardIds: string[];
}

export interface CardPair {
  cardIds: [string, string]; // Always sorted
  frequency: number;
  schoolId: string;
  timestamp: Date;
}

export interface School {
  id: string;
  name: string;
  studentCode: string;
  teacherCode: string;
}

export interface User {
  id: string;
  name: string;
  schoolId: string;
  role: 'student' | 'teacher';
}

export interface GameState {
  selectedCards: Card[];
  phase: 'auth' | 'name' | 'selection' | 'results';
  user: User | null;
}

export interface GameResult {
  game_name: string;
  description: string;
  rules: string[];
  materials_needed: string[];
  safety_considerations: string[];
  error?: string;
} 