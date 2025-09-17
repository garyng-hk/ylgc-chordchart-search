
import React, { useState } from 'react';
import type { DriveFile, DriveFileList, SearchParams } from './types';
import { GOOGLE_API_KEY, DRIVE_API_URL, GOOGLE_DRIVE_FOLDER_ID } from './constants';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsList } from './components/ResultsList';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    title: '',
    key: '',
    lyrics: '',
  });
  const [results, setResults] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleClear = () => {
    setSearchParams({ title: '', key: '', lyrics: '' });
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  const handleSearch = async () => {
    if (GOOGLE_API_KEY.startsWith('YOUR_')) {
      setError('請在 constants.ts 中設定您的 Google API Key。');
      return;
    }
    if (GOOGLE_DRIVE_FOLDER_ID.startsWith('YOUR_')) {
      setError('請在 constants.ts 中設定您的 Google Drive 資料夾 ID。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      // Pre-flight check to validate folder ID and permissions on the root folder
      const preflightUrl = `${DRIVE_API_URL}/${GOOGLE_DRIVE_FOLDER_ID}?fields=id&key=${GOOGLE_API_KEY}`;
      const preflightResponse = await fetch(preflightUrl);

      if (!preflightResponse.ok) {
        const errorData = await preflightResponse.json();
        const reason = errorData.error?.errors?.[0]?.reason;
        let userMessage = errorData.error?.message || '搜尋時發生未知錯誤。';

        if (preflightResponse.status === 403 || reason === 'forbidden' || reason === 'domainPolicy') {
          userMessage = '無法存取指定的 Google Drive 資料夾。請確認：1) 資料夾 ID 正確無誤。 2) 資料夾的共用設定為「知道連結的任何人皆可檢視」。';
        } else if (preflightResponse.status === 404 || reason === 'notFound') {
          userMessage = '找不到指定的 Google Drive 資料夾。請確認 constants.ts 中的 GOOGLE_DRIVE_FOLDER_ID 是否正確。';
        } else if (reason === 'apiKeyInvalid') {
          userMessage = '提供的 Google API Key 無效。請檢查 constants.ts 中的設定，並確認您已在 Google Cloud Console 中啟用 Google Drive API。';
        }
        
        throw new Error(userMessage);
      }

      const allFiles: DriveFile[] = [];
      const foundFileIds = new Set<string>();

      // Build query from search parameters to use in recursive search
      const { title, key, lyrics } = searchParams;
      const queryClauses = [];
      if (title) queryClauses.push(`name contains '${title.replace(/'/g, "\\'")}'`);
      if (key) queryClauses.push(`name contains '${key.replace(/'/g, "\\'")}'`);
      if (lyrics) queryClauses.push(`fullText contains '${lyrics.replace(/'/g, "\\'")}'`);
      const userQuery = queryClauses.join(' and ');

      const searchInFolder = async (folderId: string) => {
        // Query for subfolders
        const folderQuery = `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
        const foldersUrl = `${DRIVE_API_URL}?q=${encodeURIComponent(folderQuery)}&fields=files(id)&pageSize=1000&key=${GOOGLE_API_KEY}`;

        // Query for PDF files
        const fileQueryParts = [
          `'${folderId}' in parents`,
          `mimeType='application/pdf'`,
          `trashed=false`
        ];
        if (userQuery) {
          fileQueryParts.push(`(${userQuery})`);
        }
        const fileQuery = fileQueryParts.join(' and ');
        const filesUrl = `${DRIVE_API_URL}?q=${encodeURIComponent(fileQuery)}&fields=files(id, name, webViewLink, iconLink)&pageSize=1000&key=${GOOGLE_API_KEY}`;
        
        const [foldersResponse, filesResponse] = await Promise.all([
          fetch(foldersUrl),
          fetch(filesUrl),
        ]);

        if (!foldersResponse.ok || !filesResponse.ok) {
          console.error(`Error fetching data for folder ${folderId}. Status: ${foldersResponse.status}, ${filesResponse.status}`);
          // Continue gracefully, maybe some subfolders are not shared properly
          return;
        }

        const foldersData: DriveFileList = await foldersResponse.json();
        const filesData: DriveFileList = await filesResponse.json();

        // Add found files to the main list, checking for duplicates
        if (filesData.files) {
          for (const file of filesData.files) {
            if (!foundFileIds.has(file.id)) {
              foundFileIds.add(file.id);
              allFiles.push(file);
            }
          }
        }

        // Recurse into subfolders in parallel
        if (foldersData.files) {
          await Promise.all(foldersData.files.map(subfolder => searchInFolder(subfolder.id)));
        }
      };

      await searchInFolder(GOOGLE_DRIVE_FOLDER_ID);

      if (allFiles.length === 0) {
        setError("搜尋完成，但找不到任何符合條件的 PDF 檔案。請嘗試：1) 檢查關鍵字是否正確。 2) 確認您的 Google Drive 資料夾（包含所有子資料夾）權限已設為「知道連結的任何人皆可檢視」。 3) 如果是搜尋新檔案的歌詞，請稍後再試，Google Drive 需要時間建立內文索引。");
      }
      
      // Sort results alphabetically by name for consistent ordering
      allFiles.sort((a, b) => a.name.localeCompare(b.name));
      setResults(allFiles);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '發生預期外的錯誤，請檢查主控台以獲取更多資訊。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="space-y-6">
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
          {isLoading ? <Spinner /> : <ResultsList results={results} hasSearched={hasSearched} />}
        </div>
      </main>
    </div>
  );
};

export default App;
