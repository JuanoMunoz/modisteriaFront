import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import video from "/registro.mp4"
import { useForm } from "react-hook-form";
export default function Register() {
  // const EMAIL_REGEX =
  //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();
  // const onSubmit = (data) => {
  //   console.log(data);
  // };
  // console.log(watch("name"));

  return (
    <>
      <Metadata title={"Registro - Modistería Doña Luz"}></Metadata>
      <h1>Registrate</h1>

      <div className="contenedor">
        <div className="imagen">
            <video src={video} autoPlay loop muted className="video"></video>
        </div>
        <div className="form">
            <form action="#">

              <div className="input-container">
                <input type="text" className="input-field"/>
                <label className="input-label">Nombre</label>
                <span className="input-highlight"></span>
              </div>

              <div className="input-container">
                <input type="text" className="input-field"/>
                <label className="input-label">Télefono</label>
                <span className="input-highlight"></span>
              </div>

              <div className="input-container">
                <input type="text" className="input-field"/>
                <label className="input-label">Correo</label>
                <span className="input-highlight"></span>
              </div>

              <div className="input-container">
                <input type="password" className="input-field"/>
                <label className="input-label">Contraseña</label>
                <span className="input-highlight"></span>
              </div>

              <div className="input-container">
                <input type="password" className="input-field"/>
                <label className="input-label">Repetir Contraseña</label>
                <span className="input-highlight"></span>
              </div>
            </form>
        </div>
      </div>
      
    </>
  );
}
