
import React from 'react';
import { SkillType, SkillDetails } from './types';

export const SKILLS: Record<SkillType, SkillDetails> = {
  [SkillType.PYTHON]: {
    id: SkillType.PYTHON,
    name: 'Python',
    fantasyName: 'Arcane Necromancy of Code',
    description: 'Master the logic that weaves the fabric of the digital realm.',
    color: '#3776ab',
    icon: '🐍',
    lore: 'Ancient scripts whispered by the Great Serpent. Learn to automate the shadows and command the logic of the abyss.'
  },
  [SkillType.MANAGEMENT]: {
    id: SkillType.MANAGEMENT,
    name: 'Management',
    fantasyName: 'Lordship of the Iron Citadel',
    description: 'Direct the legions and govern the vast territories of project chaos.',
    color: '#e44d26',
    icon: '🏰',
    lore: 'Heavy is the crown that coordinates the knights. Command the flow of resources and steel your resolve against the siege of deadlines.'
  },
  [SkillType.SPEAKER]: {
    id: SkillType.SPEAKER,
    name: 'Public Speaking',
    fantasyName: 'Bardic Eloquence of the High Altar',
    description: 'Beguile the masses and sway the councils with the power of your voice.',
    color: '#ffd700',
    icon: '🎙️',
    lore: 'Your words are enchantments. Master the cadence of the soul to inspire hope or strike terror into the hearts of the listeners.'
  }
};

export const INITIAL_PROGRESS = [
  { skill: 'Python', level: 20, fullMark: 100 },
  { skill: 'Management', level: 15, fullMark: 100 },
  { skill: 'Speaking', level: 10, fullMark: 100 },
];
