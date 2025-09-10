export const DISTRICT_OPTIONS = ['Центр', 'Джикджилли', 'Махмутлар'] as const;
export type District = (typeof DISTRICT_OPTIONS)[number];
