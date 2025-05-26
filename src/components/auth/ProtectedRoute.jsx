import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const hasAccess = user?.roles?.some(role => allowedRoles.includes(role));
    
    return hasAccess ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;