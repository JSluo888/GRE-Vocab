export interface WordItem {
  id: string;
  word: string;
  definition: string;
  context?: string;
  synonym?: string;
  reference?: string; // e.g., "11-4"
  notes?: string; // mnemonics, roots, etc.
  category: 'core' | 'extended';
}

export type ViewMode = 'flashcards' | 'list';
export type FilterMode = 'all' | 'saved';
