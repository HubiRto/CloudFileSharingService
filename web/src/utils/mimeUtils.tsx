import {FileIcon, FolderArchive, FolderIcon, ImageIcon, VideoIcon} from "lucide-react";

export const mimeToIcon = (mimeType: string, size: number) => {
    const style = `"h-${size} w-${size} text-muted-foreground`;

    switch (mimeType) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/svg+xml': {
            return (
                <ImageIcon className={style}/>
            );
        }
        case 'video/mp4': {
            return (
                <VideoIcon className={style}/>
            );
        }
        case 'dir': {
            return (
                <FolderIcon className={`${style} text-yellow-500`}/>
            );
        }
        case 'application/zip':
        case 'application/x-tar':{
            return (
                <FolderArchive className={`${style} text-yellow-500`}/>
            );
        }
        default: {
            return (
                <FileIcon className={style}/>
            );
        }
    }
};