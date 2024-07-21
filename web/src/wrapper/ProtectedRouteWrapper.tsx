import React from 'react';
import {useAuth} from "@/providers/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {Sidebar} from "@/components/Sidebar.tsx";

type Props = React.PropsWithChildren<{}>;

export const ProtectedRouteWrapper = ({children}: Props) => {
    const {authState, isLoading} = useAuth();
    const navigate = useNavigate();

    if (!isLoading && !authState?.token) {
        navigate("/login");
    }

    return (
        <>
            <div className="flex min-h-screen w-full bg-muted/40">
                <Sidebar/>
                {children}
            </div>
        </>
    );
};
