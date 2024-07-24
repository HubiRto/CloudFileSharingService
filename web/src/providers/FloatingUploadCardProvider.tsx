import React, {createContext, ReactNode, useContext, useState} from 'react';

type FloatingUploadCardContextType = {
    openCard: (files: File[]) => void;
    closeCard: () => void;
    toggleMinimize: () => void;
    isOpen: boolean;
    isMinimalized: boolean;
    files: File[];
};

const FloatingUploadCardContext = createContext<FloatingUploadCardContextType | undefined>(undefined);

export const FloatingUploadCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimalized, setIsMinimalized] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const openCard = (files: File[]) => {
        setFiles(files);
        setIsOpen(true);
        setIsMinimalized(false);
    };

    const closeCard = () => {
        setIsOpen(false);
        setFiles([]);
    };

    const toggleMinimize = () => {
        setIsMinimalized(prev => !prev);
    };

    return (
        <FloatingUploadCardContext.Provider value={{ openCard, closeCard, toggleMinimize, isOpen, isMinimalized, files }}>
            {children}
        </FloatingUploadCardContext.Provider>
    );
};

export const useFloatingUploadCard = () => {
    const context = useContext(FloatingUploadCardContext);
    if (!context) {
        throw new Error('useFloatingUploadCard must be used within a FloatingUploadCardProvider');
    }
    return context;
};
