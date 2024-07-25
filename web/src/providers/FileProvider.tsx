import React, {createContext, ReactNode, useContext, useState} from "react";
import {FileData} from "@/models/FileData.ts";

interface FileContextType {
    files: FileData[];
    addFile: (file: FileData) => void;
    addFiles: (files: FileData[]) => void;
    removeFile: (fileName: string) => void;
    removeFiles: (ids: number[]) => void;
    removeAllFiles: () => void;
    setFiles: (newFiles: FileData[]) => void;
    renameFile: (oldName: string, newName: string, newLastUpdatedAt: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [files, setFiles] = useState<FileData[]>([]);

    const addFile = (file: FileData) => {
        setFiles(prevFiles => [...prevFiles, file]);
    };

    const addFiles = (files: FileData[]) => {
        setFiles(prevFiles => [...prevFiles, ...files]);
    };

    const removeFile = (fileName: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const removeFiles = (ids: number[]) => {
        setFiles((prevFiles) => prevFiles.filter((file) => !ids.includes(file.id)));
    };

    const removeAllFiles = () => {
        setFiles([]);
    };

    const setNewFiles = (newFiles: FileData[]) => {
        setFiles(newFiles);
    };

    const renameFile = (oldName: string, newName: string, newLastUpdatedAt: string) => {
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file.name === oldName ? {...file, name: newName, lastModifiedAt: newLastUpdatedAt} : file
            )
        );
    }


    return (
        <FileContext.Provider
            value={{files, addFile, addFiles, removeFile, removeFiles, removeAllFiles, setFiles: setNewFiles, renameFile}}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a SelectFileProvider');
    }
    return context;
};