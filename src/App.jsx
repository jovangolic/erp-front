import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import RequireAuth from "./RequireAuth"; // Importuj RequireAuth komponentu
import Profile from "./Profile";
import Login from "./components/auth/Login";
import Registration from "./Registration";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import EditBuyer from "./components/Buyer/EditBuyer";
import InventoryList from "./components/Inventory/InventoryList";
import StorageList from "./components/Storage/StorageList";
import StorageGoods from "./components/Storage/StorageGoods";
import StorageShelves from "./components/Storage/StorageShelves";
import LandingPage from "./pages/LandingPage";
import AdminCreateUser from "./components/admin/AdminCreateUser";
import UserCreate from "./components/admin/UserCreate";


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Javne rute */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/buyers/edit/:pib" element={<EditBuyer />} />
                    <Route path="/inventory/edit/:id" element={<InventoryList />} />
                    <Route path="/storage" element={<StorageList />} />
                    <Route path="/storage/:id/goods" element={<StorageGoods />} />
                    <Route path="/storage/:id/shelves" element={<StorageShelves />} />
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
                        path="/admin/create-user"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                                <AdminCreateUser />
                            </ProtectedRoute>
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

//git add .
//warning: in the working copy of 'src/App.jsx', LF will be replaced by CRLF the next time Git touches it