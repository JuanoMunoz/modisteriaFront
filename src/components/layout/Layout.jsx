import "./layout.css";
import logo from "/icon.png"

import { Outlet, Link } from "react-router-dom";
export default function Layout() {
  return (
    <>
    <header className="contenedor">

      <div className="logo">
        <a href="#"><img src={logo} className="img"></img></a>
        <h2>MODISTERIA D.L</h2>
      </div>

      <nav className="navegador">
        <ul>
            <li className="navItem">
              <Link to={"/"}>Modisteria</Link>
            </li>
            <li className="navItem">
              <Link to={"/registro"}>Registro</Link>
            </li>
            <li className="navItem">Catálogo</li>
            <li className="navItem">Contacto</li>
            <li className="navItem">Nosotros</li>
        </ul>

      </nav>
    </header>

      <Outlet></Outlet>
    </>
  );
}
