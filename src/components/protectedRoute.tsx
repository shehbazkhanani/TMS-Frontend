import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const {token} = useSelector((state: any) => state.auth); 
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    }, [])

    return <>{children}</>;
}

export default ProtectedRoute