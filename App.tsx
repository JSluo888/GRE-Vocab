import React, { useState, useEffect, useMemo } from 'react';
import { getParsedData, shuffleArray } from './utils';
import { WordItem, ViewMode } from './types';
import Flashcard from './components/Flashcard';
import WordList from './components/WordList';
import { 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  List, 
  Layers, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('flashcards');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filterSaved, setFilterSaved] = useState(false);

  // Initialize data
  useEffect(() => {
    const data = getParsedData();
    setItems(data);
    
    // Load saved progress from local storage
    const saved = localStorage.getItem('gre_saved_words');
    if (saved) {
      setSavedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  // Filter items based on mode
  const activeItems = useMemo(() => {
    if (filterSaved) {
      return items.filter(item => !savedIds.has(item.id)); // Show only unknown words
    }
    return items;
  }, [items, savedIds, filterSaved]);

  const currentItem = activeItems[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    }, 200);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    // We shuffle the main list but keep the filter logic
    // Actually, we should probably just shuffle the `items` state
    setItems(prev => shuffleArray(prev));
    setCurrentIndex(0);
  };

  const toggleSave = (id: string) => {
    const newSet = new Set(savedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSavedIds(newSet);
    localStorage.setItem('gre_saved_words', JSON.stringify(Array.from(newSet)));
  };

  // Ensure index is valid when list changes
  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  if (items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Vocabulary...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
               <Layers size={20} />
            </div>
            <div>
                <h1 className="font-bold text-lg leading-tight text-slate-900">GRE Core 390</h1>
                <p className="text-xs text-slate-500">Vocabulary Flashcards</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode(viewMode === 'flashcards' ? 'list' : 'flashcards')}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
            >
              {viewMode === 'flashcards' ? <><List size={18} /> List View</> : <><Layers size={18} /> Card View</>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col">
        
        {/* Stats / Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 text-sm">
                 <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total</span>
                    <span className="font-bold text-xl">{activeItems.length}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-emerald-500 text-xs uppercase tracking-wider font-semibold">Mastered</span>
                    <span className="font-bold text-xl text-emerald-600">{savedIds.size}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-200"></div>
                 <div className="flex flex-col">
                     <span className="text-indigo-500 text-xs uppercase tracking-wider font-semibold">Progress</span>
                     <span className="font-bold text-xl text-indigo-600">
                        {Math.round((savedIds.size / items.length) * 100)}%
                     </span>
                 </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setFilterSaved(false)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!filterSaved ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All Words
                </button>
                <button 
                    onClick={() => setFilterSaved(true)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filterSaved ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    To Learn
                </button>
            </div>
        </div>

        {viewMode === 'flashcards' ? (
             <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
                {activeItems.length > 0 ? (
                    <>
                        <div className="w-full mb-8 relative z-0">
                            <Flashcard 
                                item={currentItem} 
                                isFlipped={isFlipped} 
                                onFlip={() => setIsFlipped(!isFlipped)} 
                            />
                        </div>

                        {/* Navigation Controls */}
                        <div className="w-full grid grid-cols-3 gap-4">
                            <button 
                                onClick={handlePrev}
                                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm group"
                            >
                                <ArrowLeft className="text-slate-400 group-hover:text-indigo-600 mb-1" />
                                <span className="text-xs font-semibold text-slate-500">Prev</span>
                            </button>

                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => toggleSave(currentItem.id)}
                                    className={`flex-1 flex flex-col items-center justify-center p-2 border rounded-xl transition-all shadow-sm ${savedIds.has(currentItem.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <CheckCircle2 size={20} className="mb-1" />
                                    <span className="text-xs font-semibold">{savedIds.has(currentItem.id) ? 'Mastered' : 'Mark Known'}</span>
                                </button>
                                 <button 
                                    onClick={handleShuffle}
                                    className="flex-1 flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 text-slate-400 transition-all shadow-sm"
                                >
                                    <span className="flex items-center gap-1 text-xs font-semibold"><Shuffle size={12} /> Shuffle</span>
                                </button>
                            </div>

                            <button 
                                onClick={handleNext}
                                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm group"
                            >
                                <ArrowRight className="text-slate-400 group-hover:text-indigo-600 mb-1" />
                                <span className="text-xs font-semibold text-slate-500">Next</span>
                            </button>
                        </div>
                        
                        <div className="mt-8 text-slate-400 text-sm font-medium">
                            Card {currentIndex + 1} of {activeItems.length}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <CheckCircle2 className="text-emerald-500 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-800">All Done!</h3>
                        <p className="text-slate-500 mt-2 max-w-xs">You have marked all words in this category as mastered.</p>
                        <button 
                            onClick={() => setFilterSaved(false)}
                            className="mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all"
                        >
                            <RotateCcw size={18} /> Review All
                        </button>
                    </div>
                )}
             </div>
        ) : (
            <WordList items={activeItems} savedIds={savedIds} onToggleSave={toggleSave} />
        )}
      </main>
    </div>
  );
};

export default App;
