import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import foto from "/foto1.jfif";
import Input from "../../components/input_basico/Input";
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
      <br />
      <br />
      <h1>Registrate</h1>
      <hr className="separacion" />
      <br />

      <div className="contenedor">
        <div className="imagen">
          <img src={foto} alt="" className="imagenForm" />
        </div>
        <div className="form">
          <form action="#">
            <Input
              type={"text"}
              description={"Ingrese su nombre y apellido"}
              placeholder={"Nombres"}
            ></Input>
            <br />
            <Input
              type={"text"}
              description={"Código +57"}
              placeholder={"Télefono"}
            ></Input>
            <br />
            <Input
              type={"text"}
              description={"Ingrese un correo válido"}
              placeholder={"Correo"}
            ></Input>
            <br />
            <Input
              description={"Debe tener al menos 8 caracteres"}
              placeholder={"Contraseña"}
              canHidden
            ></Input>
            <Input
              description={"Las contraseñas deben coincidir"}
              placeholder={"Repetir contraseña"}
              canHidden
            ></Input>
            <button className="btn-registro">
              <span>Registrarme</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
