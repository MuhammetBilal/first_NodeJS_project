import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import AppLayout from "./components/AppLayout"; // Yeni Layout'umuz

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;