import React from 'react';
import type { DriveFile } from '../types';

interface PdfViewerModalProps {
  file: DriveFile | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ file, onClose }) => {
  if (!file) {
    return null;
  }

  // --- 這是關鍵的連結轉換 ---
  const previewUrl = file.webViewLink.replace(/\/view.*$/, '/preview');

  return (
    // 背景覆蓋層
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose} // 點擊背景即可關閉
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-11/12 h-5/6 flex flex-col"
        onClick={(e) => e.stopPropagation()} // 防止點擊 modal 內部時觸發背景的 onClose
      >
        {/* 標題和關閉按鈕 */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate pr-4" title={file.name}>
            {file.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        {/* 內嵌 PDF 的 iframe */}
        <div className="flex-grow p-1">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={file.name}
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    </div>
  );
};