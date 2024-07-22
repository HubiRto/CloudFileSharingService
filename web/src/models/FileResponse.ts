export interface FileResponse {
    id: number;
    name: string;
    path: string;
    isFolder: boolean;
    mime: string;
    size: number;
    createdAt: string;
}