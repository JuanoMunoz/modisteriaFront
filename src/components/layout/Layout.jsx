import { useJwt } from "../../context/JWTContext";
import useDecodedJwt from "../../hooks/useJwt";
import "./layout.css";
import logo from "/icon.png";
import Modal from "../modal/Modal";
import { Logout } from "../svg/Svg";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Cart } from "../svg/Svg";
export default function Layout() {
  const [cartVisible, setCartVisible] = useState(false);

  const { token, cleanToken } = useJwt();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const payload = useDecodedJwt(token);
  const toogleModal = () => {
    setVisible(!visible);
  };
  const toggleCart = () => {
    setCartVisible((prev) => !prev);
  };
  const logout = () => {
    cleanToken();
    toogleModal();
    toast.success("sesión cerrada con éxito!", {
      toastId: "closeSession",
      autoClose: 400,
      onClose: () => {
        navigate("/");
      },
    });
  };
  return (
    <>
      <Modal show={visible} onClose={toogleModal}>
        <Logout size={"120"}></Logout>
        <h3>Estás seguro que quieres cerrar sesión?</h3>
        <div className="logout">
          <button onClick={toogleModal} className="btn-cancelar">
            <span>cancelar</span>
          </button>
          <button onClick={logout} className="btn-accion">
            <span>cerrar sesión</span>
          </button>
        </div>
      </Modal>
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
              <Link to={"/catalogo"}>Catálogo</Link>
            </li>
            <li className="navItem">
              <Link to={"/cita"}>Citas</Link>
            </li>
            <li className="navItem">Nosotros</li>
            {token ? (
              <>
                {" "}
                <li className="navItem">
                  <Link title="Perfil" to={"/"}>
                    {payload.nombre}
                  </Link>
                </li>
                <li className="navItem">
                  <a onClick={toogleModal}>cerrar sesión</a>
                </li>
              </>
            ) : (
              <>
                <li className="navItem">
                  <Link to={"/sesion"}>Inicia Sesión</Link>
                </li>
                <li className="navItem">
                  <Link to={"/registro"}>Registro</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </section>

      <Outlet></Outlet>

      <button className="cart-button " onClick={toggleCart}>
        <Cart color="#fff" size={"27"}></Cart>
      </button>

      <nav className={`cart ${cartVisible ? "active" : ""}`}>
        <div className="opacidad-carrito"></div>
        <article className="carrito-lista">
          <button onClick={toggleCart} className="modal-close-button">
            &times;
          </button>
        </article>
      </nav>

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
