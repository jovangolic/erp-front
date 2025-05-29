import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import RequireAuth from "./RequireAuth"; // Importuj RequireAuth komponentu
import Profile from "./Profile";
import Login from "./Login";
import Registration from "./Registration";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import EditBuyer from "./components/Buyer/EditBuyer";
import InventoryList from "./components/Inventory/InventoryList";
import StorageList from "./components/Storage/StorageList";
import StorageGoods from "./components/Storage/StorageGoods";
import StorageShelves from "./components/Storage/StorageShelves";


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Javne rute */}
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