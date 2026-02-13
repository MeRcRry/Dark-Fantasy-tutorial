
export enum SkillType {
  PYTHON = 'PYTHON',
  MANAGEMENT = 'MANAGEMENT',
  SPEAKER = 'SPEAKER'
}

export interface SkillDetails {
  id: SkillType;
  name: string;
  fantasyName: string;
  description: string;
  color: string;
  icon: string;
  lore: string;
}

export interface ProgressData {
  skill: string;
  level: number;
  fullMark: number;
}

export interface Tutorial {
  title: string;
  content: string;
  difficulty: 'Novice' | 'Adept' | 'Master';
  tasks: string[];
}
