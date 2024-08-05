import "./layout.css";
import { Outlet, Link } from "react-router-dom";
export default function Layout() {
  return (
    <>
      <nav className="nav">
        <li>
          <Link to={"/"}>Modisteria</Link>
        </li>
        <li>
          <Link to={"/registro"}>Registro</Link>
        </li>
        <li>Catálogo</li>
        <li>Contacto</li>
        <li>Nosotros</li>
      </nav>
      <Outlet></Outlet>
    </>
  );
}
