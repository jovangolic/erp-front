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
import Sidebar from "./components/layout/Sidebar";
import MainLayout from "./components/layout/MainLayout";
import ViewProcurement from "./components/Procurement/ViewProcurement";
import EditProcurement from "./components/Procurement/EditProcurement";
import ProcurementList from "./components/Procurement/ProcurementList";
import AddProcurement from "./components/Procurement/AddProcurement";

const App = () => {
    return (
        <AuthProvider>
        <Router>
            <Routes>
            {/* Javne rute bez Sidebara */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/procurements" element={<ProcurementList />} />
            <Route path="/procurements/view/:procurementId" element={<ViewProcurement />} />
            <Route path="/procurements/edit/:procurementId" element={<EditProcurement />} />
            <Route path="/procurements/add" element={<AddProcurement />} />
            {/* Sve ostale rute sa Sidebar-om */}
            <Route path="/" element={<MainLayout />}>
                <Route path="buyers/edit/:pib" element={<EditBuyer />} />
                <Route path="inventory/edit/:id" element={<InventoryList />} />
                <Route path="storage" element={<StorageList />} />
                <Route path="storage/:id/goods" element={<StorageGoods />} />
                <Route path="storage/:id/shelves" element={<StorageShelves />} />

                <Route
                path="profile"
                element={
                    <RequireAuth>
                    <Profile />
                    </RequireAuth>
                }
                />

                <Route
                path="admin/create-user"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <AdminCreateUser />
                    </ProtectedRoute>
                }
                />

                <Route
                path="admin-panel"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "STORAGE_FOREMAN", "STORAGE_EMPLOYEE"]}>
                    <AdminPanel />
                    </ProtectedRoute>
                }
                />

                <Route
                path="dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <Dashboard />
                    </ProtectedRoute>
                }
                />
                {/* Dodaj ostale rute koje zahtevaju Sidebar */}
            </Route>
            </Routes>
        </Router>
    </AuthProvider>
    );
};

export default App;

//git add .
//warning: in the working copy of 'src/App.jsx', LF will be replaced by CRLF the next time Git touches it