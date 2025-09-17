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
        <div className="space-y-6"> {/* <--- 這個 div 打開了 */}
        
          <SearchBar
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSubmit={handleSearch}
            onClear={handleClear}
            isLoading={isLoading}
          />
          
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <strong className="font-bold">錯誤: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            <ResultsList 
              results={results} 
              hasSearched={hasSearched}
              onFileSelect={(file) => setSelectedFile(file)}
            />
          )}

        </div> {/* <--- 在 </main> 之前，這個 div 必須在這裡關閉 */}
      </main>

      <PdfViewerModal 
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />

    </div>
  );
};

export default App;