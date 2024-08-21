import "./sesion.css";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import foto2 from "/foto2.jfif";
import Input from "../../components/input_basico/Input";
import Metadata from "../../components/metadata/Metadata";
import OTP from "../../components/input_otp/Otp";
import { set, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import constants from "../../assets/constants.d";
import axios from "axios";
import Loading from "../../components/loading/Loading";
import useModals from "../../hooks/useSessionModals";

export default function InicioSesion() {
  const {
    handleSubmit: handleSubmit1,
    watch: watch,
    register: register1,
  } = useForm();
  const {
    handleSubmit: handleSubmit2,
    watch: watch2,
    register: register2,
  } = useForm();
  const {
    showModal,
    showModal2,
    showModal3,
    toggleModal,
    toggleModal2,
    toggleModal3,
    handleSendCode,
    changeMail,
    handleVerifyCode,
  } = useModals(
    constants.EMAIL_REGEX.test(watch2("recoveryMail")),
    watch2("recoveryMail")
  );
  const [otpCode, setOtpCode] = useState("");
  //FORM
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const onSubmit = async (data) => {
    setLoading(true);
    axios
      .post("https://modisteria-back.onrender.com/api/createUser", {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        setData(response.data);
        toast.success("sesión iniciada correctamente! 😊", {
          toastId: "success-toast-fetch-api",
        });
      })
      .catch(() => {
        toast.error("email y/o contraseña incorrecto/s", {
          toastId: "toast-error-fetch-id",
          theme: "colored",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //OTP
  const onChangeOTP = (newOTP) => {
    setOtpCode(newOTP.join(""));
  };

  return (
    <>
      {loading && <Loading></Loading>}
      <Metadata title={"Inicio Sesión - Modistería Doña Luz"}></Metadata>
      <br />
      <br />
      <span className="blackSesion">Inicia </span>
      <span className="blackSesion">Sesión</span>
      <hr className="separacionSesion" />
      <br />

      <div className="contenedorSesion">
        <div className="formSesion">
          <form onSubmit={handleSubmit1(onSubmit)}>
            <div className="inputSesion">
              <Input
                {...register1("email", { pattern: constants.EMAIL_REGEX })}
                type={"text"}
                placeholder={"Correo"}
                description={"Ingresa tu correo electrónico"}
              ></Input>
              <Input
                {...register1("password", { minLength: 8 })}
                type={"password"}
                placeholder={"Contraseña"}
                description={"Ingresa tu contraseña"}
                canHidden
              ></Input>
            </div>

            <button
              type="submit"
              disabled={
                watch("contrasenia")?.length < 8 &&
                !constants.EMAIL_REGEX.test(watch("correo"))
              }
              className="btn-registroSesion"
            >
              <span>Inicia Sesión</span>
            </button>
          </form>
          <hr className="separacionForgot" />
          <button className="forgotPass" onClick={toggleModal}>
            ¿Olvidaste tu Contraseña?
          </button>
        </div>

        <div className="imagenSesion">
          <img src={foto2} alt="" className="imagenFormSesion" />
        </div>
      </div>
      {/* MODAL */}
      <Modal show={showModal} onClose={toggleModal} className="modalPass">
        <h2>Recupera tu Contraseña</h2>
        <div className="inputModal">
          <Input
            {...register2("recoveryMail")}
            type={"text"}
            placeholder={"Correo"}
            description={"Ingresa tu correo electrónico"}
          ></Input>
        </div>

        <button className="btn-registroSesion" onClick={handleSendCode}>
          <span>Enviar Código</span>
        </button>
      </Modal>

      {/* MODAL CÓDIGO*/}
      <Modal show={showModal2} onClose={toggleModal2} className="modalPass">
        <h2>Ingresa el Código</h2>
        <div className="inputModal">
          <OTP numInputs={6} onChange={onChangeOTP}></OTP>
          <div>
            No es tú correo?{" "}
            <span onClick={changeMail} className="link-get-back">
              cambiar correo
            </span>
          </div>
        </div>

        <button className="btn-registroSesion" onClick={handleVerifyCode}>
          <span>Verificar Código</span>
        </button>
      </Modal>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      <Modal show={showModal3} onClose={toggleModal3} className="modalPass">
        <h2>Cambiar Contraseña</h2>
        <div className="inputModalPassword">
          <Input
            type={"password"}
            placeholder={"Nueva Contraseña"}
            description={"Ingresa tu nueva contraseña"}
            canHidden
          />
          <Input
            type={"password"}
            placeholder={"Confirmar Contraseña"}
            description={"Confirma tu nueva contraseña"}
            canHidden
          />
        </div>

        <button onClick={toggleModal3} className="btn-registroSesion">
          <span>Cambiar Contraseña</span>
        </button>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
