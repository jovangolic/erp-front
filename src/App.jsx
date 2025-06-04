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
import HelpForm from "./components/admin/Help/HelpForm";
import HelpList from "./components/admin/Help/HelpList";
import HelpDetails from "./components/admin/Help/HelpDetails";
import OptionForm from "./components/admin/Options/OptionForm";
import OptionList from "./components/admin/Options/OptionList";
import EditOptManager from "./components/admin/Options/EditOptManager";
import PermissionManager from "./components/admin/Permissions/PermissionManager";
import RoleManager from "./components/admin/Permissions/RoleManager";
import ReportGenerator from "./components/admin/Reports/ReportGenerator";
import ReportList from "./components/admin/Reports/ReportList";
import RoleCreateForm from "./components/admin/RoleManagement/RoleCreateForm";
import RoleList from "./components/admin/RoleManagement/RoleList";


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
            <Route path="/admin/options" element={<OptionList />} />
            <Route path="/admin/options/new" element={<OptionForm />} />
            <Route path="/admin/options/edit/:id" element={<OptionForm />} />
            <Route path="/admin/edit-opts" element={<EditOptManager />} />
            <Route path="/reports" element={<ReportList />} />
            <Route path="/reports/generate" element={<ReportGenerator />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/create" element={<RoleCreateForm />} />
            <Route path="/roles/edit/:id" element={<RoleCreateForm />} />
                <nav>
                <Link to="/permissions">Permisije</Link> |{" "}
                <Link to="/roles">Uloge</Link>
            </nav>
            <Route path="/permissions" element={<PermissionManager />} />
            <Route path="/roles" element={<RoleManager />} />
            <Route path="/" element={<HelpList />} />
            <Route path="/create" element={<HelpForm />} />
            <Route path="/edit/:id" element={<HelpForm />} />
            <Route path="/view/:id" element={<HelpDetails />} />
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
                <Route path="/admin/system-settings" element={
                    <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_SUPERADMIN"]}>
                        <SystemSettings />
                    </ProtectedRoute>
                    } />
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