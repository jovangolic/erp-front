import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import RequireAuth from "./RequireAuth"; // Importuj RequireAuth komponentu
import Profile from "./Profile";
import Login from "./Login";
import Registration from "./Registration";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Javne rute */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    
                    {/* Zaštićene rute, samo za ulogovane korisnike */}
                    <Route 
                        path="/profile" 
                        element={
                            <RequireAuth>
                                <Profile />
                            </RequireAuth>
                        } 
                    />
                    <Route 
                        path="/admin-panel" 
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "STORAGE_FOREMAN", "STORAGE_EMPLOYEE"]}>
                                <AdminPanel />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;