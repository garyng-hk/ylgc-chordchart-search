
import React from 'react';
import type { DriveFile } from '../types';
import { FilePdfIcon } from './icons/FilePdfIcon';

interface ResultsListProps {
  results: DriveFile[];
  hasSearched: boolean;
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, hasSearched }) => {
  if (!hasSearched) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <p className="text-slate-500 dark:text-slate-400">請輸入關鍵字以開始搜尋樂譜。</p>
      </div>
    );
  }

  // When a search has been performed but there are no results AND no specific error is shown.
  if (results.length === 0) {
    return (
      <div className="text-left py-6 px-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">找不到結果</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">如果出現錯誤訊息，請優先依照錯誤訊息解決。若無，請嘗試以下步驟：</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <li>請確認您輸入的關鍵字拼寫正確。</li>
          <li>嘗試使用更少或更簡單的關鍵字進行搜尋。</li>
          <li>請確認您的 Google Drive 資料夾（以及所有子資料夾）的共用設定為「知道連結的任何人皆可檢視」。</li>
          <li>若您是透過「歌詞」搜尋新上傳的檔案，請稍後再試。Google Drive 需要時間建立內文索引。</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {results.map((file) => (
          <li key={file.id}>
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <FilePdfIcon className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
              <span className="flex-grow font-medium text-slate-700 dark:text-slate-200 truncate" title={file.name}>
                {file.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
