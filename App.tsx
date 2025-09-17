import React, { useState } from 'react';
// ... (其他 import)
import { ResultsList } from './components/ResultsList';
import { Spinner } from './components/Spinner';
import { PdfViewerModal } from './components/PdfViewerModal'; // <-- 1. 引入新元件

const App: React.FC = () => {
  // ... (其他 state 不變)
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null); // <-- 2. 新增 state

  const handleClear = () => {
    // ... (內容不變)
  };

  const handleSearch = async () => {
    // ... (內容不變)
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="space-y-6">
          <SearchBar
            // ... (props 不變)
          />
          {error && (
            // ... (錯誤訊息不變)
          )}
          {isLoading ? (
            <Spinner />
          ) : (
            <ResultsList 
              results={results} 
              hasSearched={hasSearched}
              onFileSelect={(file) => setSelectedFile(file)} // <-- 3. 傳入設定 selectedFile 的函式
            />
          )}
        </div>
      </main>
      
      {/* 4. 在 App 的最外層渲染 Modal 元件 */}
      <PdfViewerModal 
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
};

export default App;