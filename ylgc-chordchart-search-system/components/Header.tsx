import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center max-w-4xl">
        <h1 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-100">
          YLGC 樂譜搜尋系統
        </h1>
      </div>
    </header>
  );
};
