import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import RequireAuth from "./RequireAuth"; // Importuj RequireAuth komponentu
import Profile from "./Profile";
import Login from "./Login";
import Registration from "./Registration";

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
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;