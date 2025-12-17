import React, { useMemo, useState } from 'react';
import { WordItem } from '../types';
import { Search } from 'lucide-react';

interface WordListProps {
  items: WordItem[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
}

const WordList: React.FC<WordListProps> = ({ items, savedIds, onToggleSave }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.definition.includes(searchTerm)
    );
  }, [items, searchTerm]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search words or meanings..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="mt-2 text-xs text-slate-500 text-right">
            Showing {filteredItems.length} of {items.length} words
        </div>
      </div>

      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm font-semibold sticky top-0">
              <th className="p-4 border-b border-slate-200 w-1/4">Word</th>
              <th className="p-4 border-b border-slate-200 w-1/2">Definition & Notes</th>
              <th className="p-4 border-b border-slate-200 w-1/6">Ref</th>
              <th className="p-4 border-b border-slate-200 w-1/12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{item.word}</td>
                <td className="p-4 text-slate-600 text-sm">{item.definition}</td>
                <td className="p-4 text-slate-400 text-xs font-mono whitespace-nowrap">{item.reference || '-'}</td>
                <td className="p-4 text-center">
                   <button 
                    onClick={() => onToggleSave(item.id)}
                    className={`p-2 rounded-full transition-colors ${savedIds.has(item.id) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                   >
                       {savedIds.has(item.id) ? '✓' : '+'}
                   </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                        No words found matching "{searchTerm}"
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordList;
