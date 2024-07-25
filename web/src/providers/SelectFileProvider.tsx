import React, {createContext, ReactNode, useContext, useState} from "react";
import {useFileContext} from "@/providers/FileProvider.tsx";

interface SelectFileContextType {
    selectedFiles: number[];
    isAnySelect: boolean;
    selectAll: (isChecked: boolean) => void;
    selectFile: (fileId: number, isChecked: boolean) => void;
    clear: () => void;
}

const SelectFileContext = createContext<SelectFileContextType | undefined>(undefined);

export const SelectFileProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const {files} = useFileContext();

    const selectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allFileIds = files.map(file => file.id);
            setSelectedFiles(allFileIds);
        } else {
            setSelectedFiles([]);
        }
    };

    const selectFile = (fileId: number, isChecked: boolean) => {
        setSelectedFiles(prevSelectedFiles =>
            isChecked ? [...prevSelectedFiles, fileId] : prevSelectedFiles.filter(id => id !== fileId)
        );
    };

    const clear = () => {
        setSelectedFiles([]);
    }

    const isAnySelect = selectedFiles.length > 0;

    return (
        <SelectFileContext.Provider
            value={{selectedFiles, isAnySelect, selectAll, selectFile, clear}}>
            {children}
        </SelectFileContext.Provider>
    );
};

export const useSelectFileContext = () => {
    const context = useContext(SelectFileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};