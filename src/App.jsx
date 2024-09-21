import "./App.css";
import { Routes, Route } from "react-router-dom";
import Error404 from "./pages/error404/Error404";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import LayoutDashboard from "./components/layoutManuela/LayoutDashboard";
import Estadisticas from "./pages/estadisticas/Estadisticas";
import InicioSesion from "./pages/sesion/Sesion";
import Catalogo from "./pages/catalogo/Catalogo";
import Citas from "./pages/Citas/Citas";
import Perfil from "./pages/perfil/Perfil";
import { useJwt } from "./context/JWTContext";
import Venta from "./pages/venta/Venta";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/registro" element={<Register />}></Route>
          <Route path="/sesion" element={<InicioSesion />}></Route>
          <Route path="/cita" element={<Citas />}></Route>
          <Route path="/catalogo" element={<Catalogo />}></Route>
          <Route path="/venta" element={<Venta />}></Route>
          <Route path="/perfil" element={<Perfil />}></Route>
        </Route>
        <Route path="/dashboard" element={<LayoutDashboard />}>
          <Route index element={<Estadisticas />}></Route>
        </Route>
        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
