import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalContextType = {
    openModal: (modalName: string, modalData?: any) => void;
    closeModal: () => void;
    isOpen: (modalName: string) => boolean;
    getModalData: <T>() => T | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openModalName, setOpenModalName] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);

    const openModal = (modalName: string, data: any = null) => {
        setOpenModalName(modalName);
        setModalData(data);
    };

    const closeModal = () => {
        setOpenModalName(null);
        setModalData(null);
    };

    const isOpen = (modalName: string) => openModalName === modalName;
    const getModalData = <T,>(): T | null => modalData as T | null;

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen, getModalData }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
