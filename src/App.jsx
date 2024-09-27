import "./App.css";
import { Routes, Route } from "react-router-dom";
import Error404 from "./pages/error404/Error404";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import LayoutDashboard from "./components/layoutManuela/LayoutDashboard";
import InicioSesion from "./pages/sesion/Sesion";
import Catalogo from "./pages/catalogo/Catalogo";
import Citas from "./pages/Citas/Citas";
import Perfil from "./pages/perfil/Perfil";
import Venta from "./pages/venta/Venta";
import Contacts from "./pages/contacts/index";
import CitasDashboard from "./pages/citasDashboard/citas";
import Insumo from "./pages/insumos/insumo";
import Roles from "./pages/roles/roles";
import Permisos from "./pages/permisos/permisos";
import Ventas from "./pages/ventas/index";
import Bar from "./pages/bar/index";
import Line from "./pages/line/index";
import Dashboard from "./pages/dashboard/index";
import CatalogoDashboard from "./pages/catalogoDashboard/index";
import Cotizacion from "./pages/cotizacion/cotizacion";
import PQRs from "./pages/PQRs/PQRs";
import CategoriaInsumos from "./pages/categoriaInsumo/categoriaInsumo";
import CategoriaPrenda from "./pages/categoriaPrenda/categoriaPrenda";
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
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/contacts" element={<Contacts />} />
          <Route path="/dashboard/catalogo" element={<CatalogoDashboard />} />
          <Route path="/dashboard/categoriaInsumos" element={<CategoriaInsumos />} />
          <Route path="/dashboard/categoriaPrenda" element={<CategoriaPrenda />} />
          <Route path="/dashboard/cita" element={<CitasDashboard />} />
          <Route path="/dashboard/insumo" element={<Insumo />} />
          <Route path="/dashboard/cotizacion" element={<Cotizacion />} />
          <Route path="/dashboard/roles" element={<Roles />} />
          <Route path="/dashboard/permisos" element={<Permisos />} />
          <Route path="/dashboard/ventas" element={<Ventas />} />
          <Route path="/dashboard/bar" element={<Bar />} />
          <Route path="/dashboard/line" element={<Line />} />
          <Route path="/dashboard/pqrs" element={<PQRs />} />
          {/* <Route path="/calendar" element={<Calendar />} /> */}
        </Route>
        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
