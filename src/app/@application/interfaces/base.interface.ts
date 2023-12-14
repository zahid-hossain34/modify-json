export class FileNode {
    children!: FileNode[];
    root!: string;
    value: any;
  }
  export interface IUploadFileDetails{
    fileName?: string;
    fileInput?: string ;
    selectedFile?: File ;
  }