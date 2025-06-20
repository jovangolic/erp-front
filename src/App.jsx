import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Container, Nav, Navbar } from 'react-bootstrap';
import RequireAuth from "./components/auth/RequireAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import AdminPanel from "./components/admin/AdminPanel";
import AdminCreateUser from "./components/admin/AdminCreateUser";
import UserCreate from "./components/admin/UserCreate";
import EditBuyer from "./components/Buyer/EditBuyer";
import InventoryList from "./components/Inventory/InventoryList";
import StorageList from "./components/Storage/StorageList";
import StorageGoods from "./components/Storage/StorageGoods";
import StorageShelves from "./components/Storage/StorageShelves";
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
import EditSystemSettingModal from "./components/admin/SystemSettings/EditSystemSettingModal";
import LocalizedOptionManager from "./components/admin/SystemSettings/LocalizedOptionManager";
import AdminSystemPage from "./components/admin/AdminSystemPage";
import SystemSettings from "./components/admin/SystemSettings/SystemSettings";
import Sidebar from "./components/layout/Sidebar";
import MainLayout from "./components/layout/MainLayout";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* Navigacija */}
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">Podešavanja Sistema</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/edit-options">Edit Opcije</Nav.Link>
                            <Nav.Link href="/localized-options">Lokalizovane Opcije</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                <nav className="p-2">
                    <Link to="/permissions">Permisije</Link> |{" "}
                    <Link to="/roles">Uloge</Link>
                </nav>

                <Container className="mt-4">
                    <Routes>
                        {/* Javne rute */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
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
                        <Route path="/admin/system" element={<AdminSystemPage />} />
                        <Route path="/permissions" element={<PermissionManager />} />
                        <Route path="/role-manager" element={<RoleManager />} />
                        <Route path="/help" element={<HelpList />} />
                        <Route path="/create" element={<HelpForm />} />
                        <Route path="/edit/:id" element={<HelpForm />} />
                        <Route path="/view/:id" element={<HelpDetails />} />
                        <Route path="/edit-options" element={<EditSystemSettingModal />} />
                        <Route path="/localized-options" element={<LocalizedOptionManager />} />

                        {/* Redirekcija */}
                        <Route path="/home" element={<Navigate to="/admin/system" replace />} />

                        {/* Zaštićene rute sa Sidebar-om */}
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

                            <Route
                                path="admin/system-settings"
                                element={
                                    <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_SUPERADMIN"]}>
                                        <SystemSettings />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Fallback za nepostojeće rute */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
};

export default App;
