import React from 'react';
import {useAuth} from "@/providers/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {ModalProvider} from "@/providers/ModalProvider.tsx";
import {FileProvider} from "@/providers/FileProvider.tsx";
import {SelectFileProvider} from "@/providers/SelectFileProvider.tsx";

type Props = React.PropsWithChildren<{}>;

export const ProtectedRouteWrapper = ({children}: Props) => {
    const {authState, isLoading} = useAuth();
    const navigate = useNavigate();

    if (!isLoading && !authState?.token) {
        navigate("/login");
    }

    return (
        <ModalProvider>
            <FileProvider>
                <SelectFileProvider>
                    {children}
                </SelectFileProvider>
            </FileProvider>
        </ModalProvider>
    );
};
