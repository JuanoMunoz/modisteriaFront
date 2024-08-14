import "./App.css";
import { Routes, Route } from "react-router-dom";
import Error404 from "./pages/error404/Error404";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import LayoutDashboard from "./components/layoutManuela/LayoutDashboard";
import Estadisticas from "./pages/estadisticas/Estadisticas";
import InicioSesion from "./pages/sesion/Sesion";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/registro" element={<Register />}></Route>
          <Route path="/sesion" element={<InicioSesion/>}></Route>
        </Route>
        <Route path="/dashboard" element={<LayoutDashboard/>}>
          <Route index element={<Estadisticas/>}></Route>
        </Route>
        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
