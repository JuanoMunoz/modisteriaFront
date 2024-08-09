import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import video from "/registro.mp4"
import foto from "/foto1.jfif"
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
      <br /><br /><h1>Registrate</h1>
      <hr className="separacion" /><br />

      <div className="contenedor">
        <div className="imagen">
            <img src={foto} alt="" className="imagenForm"/>
        </div>
        <div className="form">
            <form action="#">

              <input type="text" className="input" placeholder="Nombres"/><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <input type="text" className="input" placeholder="Télefono"/><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <input type="text" className="input" placeholder="Correo"/><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <input type="password" className="input" placeholder="Contraseña"/><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <input type="password" className="input" placeholder="Repetir Contraseña"/><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <button className="btn-registro">
                <span>Registrarme</span>
              </button>
              
            </form>
        </div>
      </div>
      
    </>
  );
}
