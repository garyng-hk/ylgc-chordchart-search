import React from 'react';
import type { DriveFile } from '../types';
import { FilePdfIcon } from './icons/FilePdfIcon';

interface ResultsListProps {
  results: DriveFile[];
  hasSearched: boolean;
  onFileSelect: (file: DriveFile) => void; // <-- 1. 新增 props
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, hasSearched, onFileSelect }) => {
  // ... (if 條件判斷部分不變)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {results.map((file) => (
          // --- 2. 這裡的修改最關鍵 ---
          <li key={file.id}>
            {/* 將 <a> 標籤改成 <button> 或 <div>，並加上 onClick 事件 */}
            <div
              onClick={() => onFileSelect(file)}
              className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <FilePdfIcon className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
              <span className="flex-grow font-medium text-slate-700 dark:text-slate-200 truncate" title={file.name}>
                {file.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};