export interface DriveFile {
  id: string;
  name: string;
  webViewLink: string;
  iconLink: string;
}

export interface DriveFileList {
  files: DriveFile[];
}

export interface SearchParams {
  title: string;
  key: string;
  lyrics: string;
}
