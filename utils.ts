import { RAW_DATA_PART_1, RAW_DATA_PART_2 } from './data';
import { WordItem } from './types';

// Regex to identify if a line ends with a pattern like "11-4" or "200-2"
const REFERENCE_REGEX = /\s(\d+-\d+)$/;
// Regex to capture the first English word/phrase at the start of the line
const WORD_REGEX = /^([a-zA-Z\s-]+?)(?=\s[^\x00-\x7F]|\sn\.|\sv\.|\sadj\.)/; 
// Fallback regex for English words at start if part of speech isn't clear
const SIMPLE_WORD_REGEX = /^([a-zA-Z\s-]+?)\s/;

const parseLine = (line: string, index: number, category: 'core' | 'extended'): WordItem | null => {
  const cleanLine = line.trim();
  if (!cleanLine) return null;

  // Skip header lines or instruction lines that contain Chinese mostly at the start without English words
  if (/^[\u4e00-\u9fa5]/.test(cleanLine)) return null; 

  let word = '';
  let definition = '';
  let reference = '';
  let remainder = cleanLine;

  // 1. Extract Reference (Question ID) if it exists at the end
  const refMatch = cleanLine.match(REFERENCE_REGEX);
  if (refMatch) {
    reference = refMatch[1];
    remainder = cleanLine.replace(REFERENCE_REGEX, '').trim();
  }

  // 2. Extract Word
  // Try precise regex first (looking for transition to Chinese or Part of Speech)
  const wordMatch = remainder.match(WORD_REGEX);
  
  if (wordMatch) {
    word = wordMatch[1].trim();
    definition = remainder.substring(wordMatch[0].length).trim();
  } else {
    // Fallback: Just take the first continuous english string
    const simpleMatch = remainder.match(SIMPLE_WORD_REGEX);
    if (simpleMatch) {
      word = simpleMatch[1].trim();
      definition = remainder.substring(simpleMatch[0].length).trim();
    } else {
        // If we can't find a clean english word at start, skip or put whole line in definition (fallback)
        // Usually means it's a header line we missed
        return null; 
    }
  }

  // 3. Clean up definition
  // Often the definition part has "Original Meaning Context Meaning Synonym" stuck together
  // We can try to split by spaces, but it's unstructured.
  // For the purpose of the flashcard, showing the whole remainder string as "Details" is safer 
  // than guessing the split points of Chinese characters without a dictionary.

  return {
    id: `${category}-${index}-${word.replace(/\s/g, '_')}`,
    word,
    definition, // Contains meaning, synonym, notes all mixed
    reference,
    category
  };
};

export const getParsedData = (): WordItem[] => {
  const lines1 = RAW_DATA_PART_1.split('\n');
  const items1 = lines1
    .map((line, idx) => parseLine(line, idx, 'core'))
    .filter((item): item is WordItem => item !== null);

  const lines2 = RAW_DATA_PART_2.split('\n');
  const items2 = lines2
    .map((line, idx) => parseLine(line, idx, 'extended'))
    .filter((item): item is WordItem => item !== null);

  return [...items1, ...items2];
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
