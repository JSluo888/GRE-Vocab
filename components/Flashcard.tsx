import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { RefreshCw, BookOpen } from 'lucide-react';

interface FlashcardProps {
  item: WordItem;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ item, isFlipped, onFlip }) => {
  // Parsing definition for better display if possible
  // Many definitions follow: "ChineseMeaning ContextMeaning Synonym" or "POS ChineseMeaning Notes"
  // We will display it raw but try to highlight English words (synonyms)

  return (
    <div 
      className="w-full max-w-2xl aspect-[4/3] sm:aspect-[3/2] cursor-pointer perspective-1000 mx-auto"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 hover:border-indigo-300 transition-colors">
            <span className="absolute top-4 right-4 text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
                {item.category === 'core' ? 'Core 390' : 'Extended'}
            </span>
            {item.reference && (
                 <span className="absolute top-4 left-4 text-xs text-slate-400 font-mono">
                 Ref: {item.reference}
               </span>
            )}
            
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 text-center break-words">
                {item.word}
            </h2>
            <p className="mt-8 text-slate-400 text-sm animate-pulse flex items-center gap-2">
                <RefreshCw size={14} /> Tap to flip
            </p>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 overflow-y-auto">
             <div className="w-full h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4 border-b-2 border-indigo-200 pb-2">
                    {item.word}
                </h3>
                
                <div className="space-y-4 text-slate-700 max-w-lg">
                    {item.definition.split(' ').map((chunk, i) => {
                        // Simple highlight for English words in the definition (usually synonyms)
                        if (/^[a-zA-Z]+$/.test(chunk) && chunk.length > 2) {
                             return <span key={i} className="inline-block bg-white px-1 rounded border border-indigo-100 font-medium text-indigo-600 mx-1">{chunk}</span>;
                        }
                        return <span key={i} className="mx-0.5">{chunk}</span>
                    })}
                </div>

                {item.reference && (
                    <div className="mt-8 pt-4 border-t border-indigo-200/50 w-full flex justify-center items-center gap-2 text-slate-500 text-sm">
                        <BookOpen size={16} />
                        <span>Question Source: {item.reference}</span>
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
