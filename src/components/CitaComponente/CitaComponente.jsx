import { useState } from "react";
import { formatDateSpanish, formaTime } from "../../assets/constants.d";
import { Cancel, Alert } from "../svg/Svg";
import Modal from "../modal/Modal";
import useFetch from "../../hooks/useFetch";
export default function CitaComponente({ value, typeAppointment }) {
  const [showModal2, setShowModal2] = useState(false);
  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  };
  const { triggerFetch: deleteCita } = useFetch();
  const [showModal3, setShowModal3] = useState(false);
  const toggleModal3 = () => {
    setShowModal3(!showModal3);
  };
  console.log(typeAppointment);

  return (
    <div key={value.id} className="cartasCitas">
      <div className="carta work">
        <div className="img-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            transform="rotate(45)"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
        <div className="carta-desc">
          <div className="carta-header">
            <div className="carta-title">Cita</div>
            {typeAppointment === "9" || typeAppointment === "10"}
            <button className="carta-menu" onClick={toggleModal2}>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </button>
          </div>
          <div className="carta-time">
            {formaTime(value.fecha)}
            <br />
            <p>{value.objetivo}</p>
          </div>
          <p className="recent">{formatDateSpanish(value.fecha)}</p>
        </div>
      </div>
      {typeAppointment === "9" && (
        <Modal show={showModal2} onClose={toggleModal2}>
          <div className="modal-header">
            <Cancel color={"rgb(187, 25, 25)"} size={"150px"}></Cancel>
            <br />
            <span>
              Deseas cancelar la Cita del {formatDateSpanish(value.fecha)}?
            </span>
            <button className="btnCancelarCita" onClick={toggleModal3}>
              <span>Continuar</span>
            </button>
          </div>
        </Modal>
      )}

      {/*MODAL DE CONFIRMACIÓN*/}
      {typeAppointment === "9" && (
        <Modal show={showModal3} onClose={toggleModal3}>
          <div className="modalConfirmar">
            <Alert size={"150px"} color={"rgb(187, 25, 25)"}></Alert> <br />
            <span>Estas seguro de cancelar tu Cita con la modista?</span>
            <div>
              <button
                className="btnCancelarCita"
                onClick={() => {
                  toggleModal3();
                  toggleModal2();
                }}
              >
                <span>Cancelar</span>
              </button>
              <button className="btnCancelarCita">
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
      {typeAppointment === "10" && (
        <Modal show={showModal3} onClose={toggleModal3}>
          <div className="modalConfirmar">
            <Alert size={"150px"} color={"rgb(187, 25, 25)"}></Alert> <br />
            <span>Estas seguro de cancelar tu Cita con la modista?</span>
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
      )}
    </div>
  );
}
