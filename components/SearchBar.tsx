import React from 'react';
import type { SearchParams } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchParams, setSearchParams, onSubmit, onClear, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            歌名
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={searchParams.title}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="例如: Amazing Grace"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            KEY (調性)
          </label>
          <input
            type="text"
            id="key"
            name="key"
            value={searchParams.key}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="例如: C, G, Am"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          歌詞 (部份)
        </label>
        <input
          type="text"
          id="lyrics"
          name="lyrics"
          value={searchParams.lyrics}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="例如: 奇異恩典"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row-reverse sm:items-center sm:justify-start gap-3 pt-2">
         <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '搜尋中...' : <><SearchIcon className="w-5 h-5" /><span>搜尋</span></>}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          清除
        </button>
      </div>

      <div className="pt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <strong>提示:</strong> 搜尋比對檔名與 PDF 內文。新檔案的內文索引需要時間。
        </p>
      </div>

    </div>
  );
};