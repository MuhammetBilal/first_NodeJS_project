import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import AppLayout from "./components/AppLayout"; // Yeni Layout'umuz
import Roles from "./pages/Roles";
import AuditLogs from "./pages/AuditLogs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Sayfası (Dışarıda kalacak) */}
        <Route path="/" element={<Login />} />

        {/* İçerideki Sayfalar (Layout içinde olacak) */}
        <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/auditlogs" element={<AuditLogs />} />
            
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;