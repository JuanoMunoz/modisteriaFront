import "./layout.css";
import logo from "/icon.png";

import { Outlet, Link } from "react-router-dom";
export default function Layout() {
  return (
    <>
      <section className="contenedorNav">
        <div className="logo">
          <a href="#">
            <img src={logo} className="img"></img>
          </a>
          <h3>MODISTERIA D.L</h3>
        </div>

        <nav className="navegador">
          <ul>
            <li className="navItem">
              <Link to={"/"}>Modisteria</Link>
            </li>
            <li className="navItem">
              <Link to={"/sesion"}>Inicia Sesión</Link>
            </li>
            <li className="navItem">
              <Link to={"/registro"}>Registro</Link>
            </li>
            <li className="navItem">
              <Link to={"/catalogo"}>Catálogo</Link>
            </li>
            <li className="navItem">Contacto</li>
            <li className="navItem">Nosotros</li>
          </ul>
        </nav>
      </section>

      <Outlet></Outlet>

      <footer className="pie-pagina">
        <div className="grupo-1">
          <div className="box">
            <figure>
              <a href="#">
                <img src={logo} className="logoFooter" />
              </a>
            </figure>
          </div>
          <div className="box">
            <span className="nosotros">SOBRE </span>
            <span className="nosotros purple">NOSOTROS</span>
            <p>Jovenes emprendedores con objetivos claros y concretos.</p>
            <p>
              ¿Quieres saber mas sobre nosotros y como aportamos al sitio web?{" "}
              <a href="">
                <b>Ver mas...</b>
              </a>
            </p>
          </div>

          <div className="box">
            <span className="contacto">CONTACTANOS</span>
            <p>Dirección: Calle 123, N° 1234, Ciudad.</p>
            <p>Email: info@modisteria.com</p>
            <p>Telefono: 3123456789</p>
          </div>
        </div>
        <div className="grupo-2">
          <small>
            &copy; 2024 <b>Modisteria D.L</b> - Todos los Derechos Reservados.
          </small>
        </div>
      </footer>
    </>
  );
}
