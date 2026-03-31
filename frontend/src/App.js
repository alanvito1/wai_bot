import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import KnowledgeBase from "./pages/KnowledgeBase";
import Leads from "./pages/Leads";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/settings/Index";
import { useState } from "react";
import Login from "./pages/Login";

function App() {
    const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));

    return isAuthenticated ? (
        <Router>
            <div className="p-4">
                <nav className="mb-4">
                    <Link to="/dashboard" className="mr-4">📊 Dashboard</Link>
                    <Link to="/knowledge" className="mr-4">📚 Base de Conhecimento</Link>
                    <Link to="/leads" className="mr-4">📋 Leads</Link>
                    <Link to="/settings" className="mr-4">⚙️ Configurações</Link>
                    <button onClick={() => { localStorage.removeItem("token"); setAuthenticated(false); }} className="ml-4 text-red-500">🚪 Sair</button>
                </nav>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/settings/*" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    ) : (
        <Login onLogin={() => setAuthenticated(true)} />
    );
}

export default App;
