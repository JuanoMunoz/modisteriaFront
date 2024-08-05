import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import { useForm } from "react-hook-form";
export default function Register() {
  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  console.log(watch("name"));

  return (
    <>
      <Metadata title={"Registro - Modistería Doña Luz"}></Metadata>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <section>
          <article>
            <label htmlFor="">
              <h4>Nombre</h4>
              <input {...register("name", { required: true })} type="text" />
              {errors.name?.type === "required" && <h6>la rompiste sapo</h6>}
            </label>
            <label htmlFor="">
              <h4>Email</h4>
              <input
                type="email"
                {...register("email", { required: true, pattern: EMAIL_REGEX })}
              />
              {errors.name?.type === "required" && <h6>Es requerido sapo</h6>}
              {errors.name?.type === "pattern" && (
                <h6>No es un correo válido gonorriento</h6>
              )}
            </label>
          </article>
          <article>
            <label htmlFor="">
              <h4>Teléfono</h4>
              <input type="tel" name="" id="" />
            </label>
            <label htmlFor="">
              <h4>Contraseña</h4>
              <input type="password" name="" id="" />
            </label>
          </article>
        </section>
        <button className="boton-submit">crear cuenta</button>
      </form>
    </>
  );
}
