import Metadata from "../../components/metadata/Metadata";
import { useState, useEffect } from "react";
import "./perfil.css";
import fotoPerfil from "/fotoPerfil.jpg";
import {
  User,
  Phone,
  Mail,
  Rol,
  Key,
  Cancel,
  Alert,
  Password,
} from "../../components/svg/Svg";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input_basico/Input";
import useDecodedJwt from "../../hooks/useJwt";
import { useJwt } from "../../context/JWTContext";
import { Navigate } from "react-router-dom";

export default function Perfil() {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  console.log(payload);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const [showModal2, setShowModal2] = useState(false);
  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  };

  const [showModal3, setShowModal3] = useState(false);
  const toggleModal3 = () => {
    setShowModal3(!showModal3);
  };

  const [showModal4, setShowModal4] = useState(false);
  const toggleModal4 = () => {
    setShowModal4(!showModal4);
  };

  const [showModal5, setShowModal5] = useState(false);
  const toggleModal5 = () => {
    setShowModal5(!showModal5);
  };

  return (
    <>
      <Metadata title={"Perfil - Modistería Doña Luz"}></Metadata>
      {!token && <Navigate to={"/"} replace={true} />}
      <div className="titulo">
        <h1>Mi Perfil</h1>
        <hr />
      </div>

      <section className="miPerfil">
        <div className="contenedorPerfil">
          <div className="info1">
            <div className="imgNombre">
              <img src={fotoPerfil} alt="" className="fotoPerfil" />
              <br />
              <span>{payload.nombre}</span>
              <br />
            </div>
            <span>
              <span className="subtitulo">
                <Key></Key>&nbsp;&nbsp;ID:
              </span>{" "}
              #{payload.id}
            </span>
            <br />
            <span>
              <span className="subtitulo">
                <Rol></Rol>&nbsp;&nbsp;Rol:
              </span>{" "}
              {payload.roleId === 1 ? "Cliente" : "Administrador"}
            </span>
          </div>

          <div className="info2">
            <div className="infoGeneral">
              <div className="encabezado">
                <span>Información General</span>

                <button className="editInfo" onClick={toggleModal}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
              </div>

              <table>
                <tr>
                  <th>
                    <User></User>&nbsp;&nbsp;Nombre
                  </th>
                  <td>:</td>
                  <td>{payload.nombre}</td>
                </tr>
                <tr>
                  <th>
                    <Phone></Phone>&nbsp;&nbsp;Telefono
                  </th>
                  <td>:</td>
                  <td>{payload.telefono}</td>
                </tr>
                <tr>
                  <th>
                    <Mail></Mail>&nbsp;&nbsp;Correo
                  </th>
                  <td>:</td>
                  <td>{payload.email}</td>
                </tr>
                <tr>
                  <th>
                    <Rol></Rol>&nbsp;&nbsp;Rol
                  </th>
                  <td>:</td>
                  <td>{payload.roleId === 1 ? "Cliente" : "Administrador"}</td>
                </tr>
                <tr>
                  <th>
                    <Password size={"20px"}></Password>&nbsp;&nbsp;Password
                  </th>
                  <td>:</td>
                  <td>
                    <button className="editInfo" onClick={toggleModal4}>
                      <svg className="edit-svgIcon" viewBox="0 0 512 512">
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>

                <Modal show={showModal4} onClose={toggleModal4}>
                  <div className="modalCambiarPassword">
                    <span>Validar Contraseña</span>
                    <div className="bodyCambiarPassword">
                      <span>Ingresa tu contraseña actual</span>
                      <Input
                        type={"password"}
                        placeholder={"Contraseña actual"}
                        canHidden
                      ></Input>

                      <button
                        className="btnCancelarCita"
                        onClick={toggleModal5}
                      >
                        <span>Validar</span>
                      </button>
                    </div>
                  </div>
                </Modal>

                <Modal show={showModal5} onClose={toggleModal5}>
                  <div className="modalActualizar">
                    <span>Cambiar Contraseña</span>
                    <Input
                      type={"password"}
                      placeholder={"Nueva Contraseña"}
                      canHidden
                    ></Input>
                    <Input
                      type={"password"}
                      placeholder={"Confirmar Contraseña"}
                      canHidden
                    ></Input>

                    <button className="btnCancelarCita">
                      <span>Actualizar</span>
                    </button>
                  </div>
                </Modal>
              </table>
            </div>

            <Modal show={showModal} onClose={toggleModal}>
              <div className="modal-headerEditar">
                <span className="subtituloEditar">Edición de Información</span>
                <Input
                  type={"text"}
                  placeholder={"Nombre"}
                  value={"Cristian Vélez Bolivar"}
                ></Input>

                <Input
                  type={"text"}
                  placeholder={"Telefono"}
                  value={"3245397230"}
                ></Input>

                <Input
                  type={"text"}
                  placeholder={"Correo"}
                  value={"cristianvelez308@gmail.com"}
                ></Input>

                <button className="btnCancelarCita">
                  <span>Actualizar</span>
                </button>
              </div>
            </Modal>

            <div className="misCitas">
              <span className="subtituloCitas">Mis Citas</span>

              <div className="cartasCitas">
                <div class="carta work">
                  <div class="img-section">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(45)"
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                      <path d="M16 3v4" />
                      <path d="M8 3v4" />
                      <path d="M4 11h16" />
                      <path d="M7 14h.013" />
                      <path d="M10.01 14h.005" />
                      <path d="M13.01 14h.005" />
                      <path d="M16.015 14h.005" />
                      <path d="M13.015 17h.005" />
                      <path d="M7.01 17h.005" />
                      <path d="M10.01 17h.005" />
                    </svg>{" "}
                  </div>
                  <div class="carta-desc">
                    <div class="carta-header">
                      <div class="carta-title">
                        Cita <span>#1</span>
                      </div>
                      <button class="carta-menu" onClick={toggleModal2}>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </button>
                    </div>
                    <div class="carta-time">
                      3:01 <span>pm</span>
                      <br />
                      <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Officia voluptas reiciendis saepe rerum suscipit
                        mollitia obcaecati
                      </p>
                    </div>
                    <p class="recent">23/9/2024</p>
                  </div>
                </div>

                <Modal show={showModal2} onClose={toggleModal2}>
                  <div className="modal-header">
                    <Cancel color={"rgb(187, 25, 25)"} size={"150px"}></Cancel>
                    <br />
                    <span>Deseas cancelar la Cita del dia 23/9/2024?</span>
                    <button className="btnCancelarCita" onClick={toggleModal3}>
                      <span>Continuar</span>
                    </button>
                  </div>
                </Modal>

                {/*MODAL DE CONFIRMACIÓN*/}
                <Modal show={showModal3} onClose={toggleModal3}>
                  <div className="modalConfirmar">
                    <Alert size={"150px"} color={"rgb(187, 25, 25)"}></Alert>{" "}
                    <br />
                    <span>
                      Estas seguro de cancelar tu Cita con la modista?
                    </span>
                    <button className="btnCancelarCita">
                      <span>Confirmar</span>
                    </button>
                    <button
                      className="btnCancelarCita"
                      onClick={() => {
                        toggleModal3();
                        toggleModal2();
                      }}
                    >
                      <span>Cancelar</span>
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="misDomicilios">
              <span>Mis Domicilios</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
