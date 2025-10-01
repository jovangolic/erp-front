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
import ReportGenerator from "./components/admin/Reports/ReportGenerator";
import ReportList from "./components/admin/Reports/ReportList";
import RoleCreateForm from "./components/admin/RoleManagement/RoleCreateForm";
import RoleList from "./components/admin/RoleManagement/RoleList";
import AdminSystemPage from "./components/admin/AdminSystemPage";
import SystemSettings from "./components/admin/SystemSettings/SystemSettings";
import Sidebar from "./components/layout/Sidebar";
import MainLayout from "./components/layout/MainLayout";
import DefectPage from "./components/Defect/DefectPage";
import DefectList from "./components/Defect/DefectList";
import AddDefect from "./components/Defect/AddDefect";
import EditDefect from "./components/Defect/EditDefect";
import HelpPage from "./components/top-menu-bar/Help/HelpPage";
import Welcome from "./components/top-menu-bar/Help/Welcome";
import About from "./components/top-menu-bar/Help/About";
import Content from "./components/top-menu-bar/Help/Content";
import Title from "./components/top-menu-bar/Help/Title";
import IsVisible from "./components/top-menu-bar/Help/IsVisible";
import HelpCategorySelect from "./components/top-menu-bar/Help/HelpCategorySelect";
import OptionPage from "./components/top-menu-bar/Option/OptionPage";
import Label from "./components/top-menu-bar/Option/Label";
import IsActive from "./components/top-menu-bar/Option/IsActive";
import Value from "./components/top-menu-bar/Option/Value";
import OptionCategorySelect from "./components/top-menu-bar/Option/OptionCategorySelect";
import GoToPage from "./components/top-menu-bar/GoTo/GoToPage";
import GoToCategorySelect from "./components/top-menu-bar/GoTo/GoToCategorySelect";
import GoToTypeSelect from "./components/top-menu-bar/GoTo/GoToTypeSelect";
import GoToList from "./components/top-menu-bar/Admin-page/GoToList";
import GoToModal from "./components/top-menu-bar/GoTo/GoToModal";
import GoToAdminPage from "./components/top-menu-bar/Admin-page/GoToAdminPage";
import GoToLabel from "./components/top-menu-bar/Admin-page/GoToLabel";
import IsActivePage from "./components/top-menu-bar/Admin-page/IsActivePage";
import RoleSelect from "./components/top-menu-bar/Admin-page/RoleSelect";
import ViewDefect from "./components/Defect/ViewDefect";
import EditPage from "./components/top-menu-bar/Edit/EditPage";
import EditName from "./components/top-menu-bar/Edit/EditName";
import EditValue from "./components/top-menu-bar/Edit/EditValue";
import EditOptList from "./components/top-menu-bar/Edit/EditOptList";
import EditOptForm from "./components/top-menu-bar/Edit/EditOptForm";
import EditTypeSelect from "./components/top-menu-bar/Edit/EditTypeSelect";
import FilePage from "./components/top-menu-bar/File/FilePage";
import FileOptList from "./components/top-menu-bar/File/FileOptList";
import FileOptForm from "./components/top-menu-bar/File/FileOptForm";
import FileActionsSelector from "./components/top-menu-bar/File/FileActionsSelector";
import FileOptIndex from "./components/top-menu-bar/File/FileOptIndex";
import FileActionsAdvanced from "./components/top-menu-bar/File/FileActionsAdvanced";
import EditOptListPage from "./components/top-menu-bar/Edit/EditOptListPage";
import FileOptAdvancedPage from "./components/top-menu-bar/File/FileOptAdvancedPage";
import FileOptAdvancedPageWrapper from "./components/top-menu-bar/File/FileOptAdvancedPageWrapper";
import SystemSettingPage from "./components/top-menu-bar/System/SystemSetting/SystemSettingPage";
import SystemSettingIndexPage from "./components/top-menu-bar/System/SystemSetting/SystemSettingIndexPage";
import SystemSettingCategoryType from "./components/top-menu-bar/System/SystemSetting/SystemSettingCategoryType";
import SystemSettingDataType from "./components/top-menu-bar/System/SystemSetting/SystemSettingDataType";
import SettingKeyField from "./components/top-menu-bar/System/SystemSetting/SettingKeyField";
import SystemSettingForm from "./components/top-menu-bar/System/SystemSetting/SystemSettingForm";
import SystemStatePage from "./components/top-menu-bar/System/SystemState/SystemStatePage";
import SystemStateIndexPage from "./components/top-menu-bar/System/SystemState/SystemStateIndexPage";
import SystemStateForm from "./components/top-menu-bar/System/SystemState/SystemStatusForm";
import SystemStateDetailsPage from "./components/top-menu-bar/System/SystemState/SystemStateDetailsPage";
import SystemStatusType from "./components/top-menu-bar/System/SystemState/SystemStatusType";
import LanguageIndexPage from "./components/top-menu-bar/System/Language/LanguageIndexPage";
import LanguageForm from "./components/top-menu-bar/System/Language/LanguageForm";
import LanguageListPage from "./components/top-menu-bar/System/Language/LanguageListPage";
import LanguageNameTypes from "./components/top-menu-bar/System/Language/LanguageNameTypes";
import LanguageCodeTypes from "./components/top-menu-bar/System/Language/LanguageCodeTypes";
import LanguagePage from "./components/top-menu-bar/System/Language/LanguagePage";
import SecuritySettingPage from "./components/top-menu-bar/System/SecuritySetting/SecuritySettingPage";
import SecuritySettingIndexPage from "./components/top-menu-bar/System/SecuritySetting/SecuritySettingIndexPage";
import SecuritySettingListPage from "./components/top-menu-bar/System/SecuritySetting/SecuritySettingListPage";
import SecuritySettingForm from "./components/top-menu-bar/System/SecuritySetting/SecuritySettingForm";
import LocalizedOptionPage from "./components/top-menu-bar/System/LocalizedOption/LocalizedOptionPage";
import LocalizedOptionIndexPage from "./components/top-menu-bar/System/LocalizedOption/LocalizedOptionIndexPage";
import LocalizedOptionDetailsPage from "./components/top-menu-bar/System/LocalizedOption/LocalizedOptionDetailsPage";
import LocalizedOptionForm from "./components/top-menu-bar/System/LocalizedOption/LocalizedOptionForm";
import PermissionPage from "./components/top-menu-bar/System/Permission/PermissionPage";
import PermissionIndexPage from "./components/top-menu-bar/System/Permission/PermissionIndexPage";
import PermissionListPage from "./components/top-menu-bar/System/Permission/PermissionListPage";
import PermissionResourceTypes from "./components/top-menu-bar/System/Permission/PermissionResourceTypes";
import PermissionActionTypes from "./components/top-menu-bar/System/Permission/PermissionActionTypes";
import PermissionForm from "./components/top-menu-bar/System/Permission/PermissionForm";
import DeleteDefect from "./components/Defect/DeleteDefect";
import SearchDefect from "./components/Defect/SearchDefect";
import GeneralSearchDefectPage from "./components/Defect/GeneralSearchDefectPage";
import TrackDefect from "./components/Defect/TrackDefect";
import ReportsDefect from "./components/Defect/ReportsDefect";
import DriverPage from "./components/Driver/DriverPage";
import AddDriver from "./components/Driver/AddDriver";
import ReportsDashboard from "./components/Driver/ReportsDashboard";
import DriverList from "./components/Driver/DriverList";
import DriverReport from "./components/Driver/DriverReport";
import GeneralSearchDriverPage from "./components/Driver/GeneralSearchDriverPage";
import EditDriver from "./components/Driver/EditDriver";
import ViewDriver from "./components/Driver/ViewDriver";
import DeleteDriver from "./components/Driver/DeleteDriver";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* Navigacija */}
                

                <Container className="mt-4">
                    <Routes>
                        {/* Javne rute */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/reports" element={<ReportList />} />
                        <Route path="/reports/generate" element={<ReportGenerator />} />
                        <Route path="/roles" element={<RoleList />} />
                        <Route path="/roles/create" element={<RoleCreateForm />} />
                        <Route path="/roles/edit/:id" element={<RoleCreateForm />} />
                        <Route path="/admin/system" element={<AdminSystemPage />} />



                        {/**NOVE PUTANJE!!!!!!!!!!!!!!!! koje ce biti sablon za sve ostale buduce putanje */}    
                        {/**Quality-Control field */}      
                        {/* DefectPage kao parent route */}
                        <Route path="/defects" element={<DefectPage />}>
                            <Route index element={<DefectList />} /> {/* default */}
                            <Route path="add" element={<AddDefect />} />
                            <Route path="edit" element={<EditDefect />} />
                            {/**Da bi se prikazala stranica sa praznom formom */}
                            <Route path="edit/:id" element={<EditDefect />} />
                            <Route path="view" element={<ViewDefect />}/>
                            <Route path="lists" element={<DefectList />}/>
                            <Route path="delete" element={<DeleteDefect />} />
                            <Route path="search" element={<SearchDefect />} />
                            <Route path="general-search" element={<GeneralSearchDefectPage />} />
                            <Route path="track-defect" element={<TrackDefect />} />
                            <Route path="reports" element={<ReportsDefect />} />
                        </Route>


                        {/**Logistics field */}
                        {/**Driver page */}
                        <Route path="/drivers" element={<DriverPage />} >
                            <Route index element={<DriverPage />}/>
                            <Route path="add" element={<AddDriver />}/>
                            <Route path="edit" element={<EditDriver />}/>
                            <Route path="edit/:id" element={<EditDriver />} />
                            <Route path="view" element={<ViewDriver />}/>
                            <Route path="delete" element={<DeleteDriver />}/>
                            <Route path="lists" element={<DriverList />}/>
                            <Route path="general-search" element={<GeneralSearchDriverPage />}/>
                            <Route path="report" element={<DriverReport />}/>
                            <Route path="dashboard" element={<ReportsDashboard />}/>
                        </Route>
                        {/*HelpPage */}
                        <Route path="/help" element={<HelpPage />}>
                            <Route index element={<Welcome />} />          {/* /help */}
                            <Route path="welcome" element={<Welcome />} />{/* /help/welcome */}
                            <Route path="about" element={<About />} />    {/* /help/about */}
                            <Route path="content" element={<Content />} />
                            <Route path="category" element={<HelpCategorySelect />} />
                            <Route path="title" element={<Title />} />
                            <Route path="isVisible" element={<IsVisible />} />
                        </Route>
                        {/*Option page */}
                        <Route path="/option" element={<OptionPage />} >
                            <Route index element={<Label />} />
                            <Route path="label" element={<Label />}/>
                            <Route path="value" element={<Value />}/>
                            <Route path="category" element={<OptionCategorySelect />} />
                            <Route path="active" element={<IsActive />} />
                        </Route>
                        {/**EditOpt page */}
                        <Route path="/edit" element={<EditPage />}>
                            <Route index element={<EditName />} />
                            <Route path="name" element={<EditName />}/>
                            <Route path="value" element={<EditValue />}/>
                            <Route path="opt-type" element={<EditTypeSelect />}/>
                            <Route path="opt-list" element={<EditOptList />}/>
                            <Route path="opt-form" element={<EditOptForm />}/>
                            <Route path="opt-list-page" element={<EditOptListPage />}/>
                        </Route> 
                        {/**System Setting */}
                        <Route path="/system-setting" element={<SystemSettingPage />}>
                            <Route index element={<SystemSettingIndexPage />} />
                            <Route path="sys-category" element={<SystemSettingCategoryType />} />
                            <Route path="sys-data-type" element={<SystemSettingDataType />} />
                            <Route path="sys-key" element={<SettingKeyField />} />
                            <Route path="sys-form" element={<SystemSettingForm />} />
                        </Route>
                        {/**SystemState */}
                        <Route path="/system-state" element={<SystemStatePage />} >
                            <Route index element={<SystemStateIndexPage />} />
                            <Route path="form" element={<SystemStateForm />} />
                            <Route path="status" element={<SystemStatusType />}/>
                            <Route path="details/:id" element={<SystemStateDetailsPage />} />
                        </Route>
                        {/**Language */}
                        <Route path="/language" element={<LanguagePage />}>
                            <Route index element={<LanguageIndexPage />} />
                            <Route path="form" element={<LanguageForm />} />
                            <Route path="list" element={<LanguageListPage />} />
                            <Route path="name" element={<LanguageNameTypes />}/>
                            <Route path="code" element={<LanguageCodeTypes />}/>
                        </Route>
                        {/**Permission */}
                        <Route path="/permission" element={<PermissionPage />} >
                            <Route index element={<PermissionIndexPage />}/>
                            <Route path="form" element={<PermissionForm />}/>
                            <Route path="resource-type" element={<PermissionResourceTypes />}/>
                            <Route path="action-type" element={<PermissionActionTypes />}/>
                            <Route path="list" element={<PermissionListPage />}/>
                        </Route>
                        {/**Security Settings */}
                        <Route path="/security-setting" element={<SecuritySettingPage />} >
                            <Route index element={<SecuritySettingIndexPage />}/>
                            <Route path="list" element={<SecuritySettingListPage />}/>
                            <Route path="form" element={<SecuritySettingForm />}/>
                        </Route>
                        {/**LocalizedOptions */}
                        <Route path="/localized-options" element={<LocalizedOptionPage />} >
                            <Route index element={<LocalizedOptionIndexPage />}/>
                            <Route path="details/:id" element={<LocalizedOptionDetailsPage />} />
                            <Route path="create" element={<LocalizedOptionForm />} />
                            <Route path="edit/:id" element={<LocalizedOptionForm />} />
                        </Route>
                        {/**FileOpt page */}
                        <Route path="/file" element={<FilePage />}>
                            <Route index element={<FileOptIndex />}/>
                            <Route path="opt-index" element={<FileOptIndex />}/>
                            <Route path="opt-list" element={<FileOptList />}/>
                            <Route path="opt-form" element={<FileOptForm />}/>
                            <Route path="action-selector" element={<FileActionsSelector />}/>
                            <Route
                                path="opt-advanced-actions/:fileOptId"
                                element={<FileOptAdvancedPageWrapper />}
                            />
                        </Route>
                        {/*GoTo page */}
                        <Route path="/goto" element={<GoToPage />} >
                            <Route index element={<GoToModal />}/>
                            <Route path="modal" element={<GoToModal />}/>
                            <Route path="category" element={<GoToCategorySelect />}/>
                            <Route path="type" element={<GoToTypeSelect />}/>
                        </Route>
                        {/*Admin-page */}
                        <Route path="/admin" element={<GoToAdminPage />} >
                            <Route index element={<GoToLabel />}/>
                            <Route path="list" element={<GoToList />}/>
                            <Route path="go-to-label" element={<GoToLabel />}/>
                            <Route path="is-active" element={<IsActivePage />}/>
                            <Route path="roles" element={<RoleSelect />}/>
                        </Route>
                        
                        {/* Ostale rute */}
                        <Route path="/login" element={<h3>Login Page (TODO)</h3>} />

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

/**
 *<Navbar bg="dark" variant="dark" expand="lg">
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
 */