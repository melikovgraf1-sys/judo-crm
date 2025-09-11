export const DISTRICT_OPTIONS = ['Центр', 'Джикджилли', 'Махмутлар'] as const;
export type District = (typeof DISTRICT_OPTIONS)[number];

// Days of week for trainings per district: 0 = Sunday ... 6 = Saturday
export const DISTRICT_TRAINING_DAYS: Record<District, number[]> = {
  Центр: [2, 4], // Tuesday, Thursday
  Джикджилли: [3, 6], // Wednesday, Saturday
  Махмутлар: [1, 5], // Monday, Friday
};
