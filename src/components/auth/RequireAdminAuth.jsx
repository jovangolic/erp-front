import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RequireAdminAuth = ({ children }) => {
    const { user } = useAuth();

    // Ako korisnik nije ulogovan ili nema odgovarajuću ulogu
    if (!user || !user.roles.includes('ADMIN')) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default RequireAdminAuth;