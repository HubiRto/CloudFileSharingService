import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ProtectedRouteWrapper} from "@/wrapper/ProtectedRouteWrapper.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import RegisterPage from "@/pages/auth/RegisterPage.tsx";
import {AuthProvider} from "@/providers/AuthContext.tsx";
import {ToastProvider} from "@/providers/ToastProvider.tsx";
import {ThemeProvider} from "@/providers/ThemeProvider.tsx";

const wrapWithProtectedRoute = (element: React.ReactNode) => <ProtectedRouteWrapper children={element}/>;


const routesConfig = [
    {path: "/my-files", element: <HomePage/>, wrappers: [wrapWithProtectedRoute], errorElement: <ErrorPage/>},
    {path: "/shared-with-me", element: <HomePage/>, wrappers: [wrapWithProtectedRoute], errorElement: <ErrorPage/>},
    {path: "/shared-by-me", element: <HomePage/>, wrappers: [wrapWithProtectedRoute], errorElement: <ErrorPage/>},
    {path: "/trash", element: <HomePage/>, wrappers: [wrapWithProtectedRoute], errorElement: <ErrorPage/>},
    {path: "/login", element: <LoginPage/>, wrappers: [], errorElement: <ErrorPage/>},
    {path: "/register", element: <RegisterPage/>, wrappers: [], errorElement: <ErrorPage/>},
];

const composeWrappers = (wrappers: ((element: React.ReactNode) => React.ReactNode)[], element: React.ReactNode) =>
    wrappers.reduceRight((acc, wrapper) => wrapper(acc), element);

const routes = routesConfig.map(({path, element, wrappers, errorElement}) => ({
    path,
    element: composeWrappers(wrappers, element),
    errorElement
}));

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <ToastProvider/>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RouterProvider router={router}/>
        </ThemeProvider>
    </AuthProvider>
)
