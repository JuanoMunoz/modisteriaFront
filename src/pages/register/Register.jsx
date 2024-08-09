import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import React, {useState} from "react";
import video from "/registro.mp4"
import foto from "/foto1.jfif"
import ojoAbierto from "/ojoAbierto.png"
import ojoCerrado from "/ojoCerrado.png"
import ojito from "/verPass.png"

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

  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }


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

              {/*CONTRASEÑA*/}
              <input 
              type={showPassword ? 'text': 'password'} 
              className="input" 
              placeholder="Contraseña" 
              id="password"
              onChange={handlePasswordChange}
              /><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <img 
              src={showPassword ? ojoAbierto : ojoCerrado} 
              alt="" 
              className="verPass" 
              onClick={togglePasswordVisibility}/>

              {/*REPETIR CONTRASEÑA*/}
              <input 
              type={showConfirmPassword ? 'text': 'password'} 
              className="input" 
              placeholder="Repetir Contraseña"
              id="password2"
              onChange={handleConfirmPasswordChange}
              /><br />
              <span className="descripcion">Descripcion descripcion descripcion</span><br/>

              <img 
              src={showConfirmPassword ? ojoAbierto : ojoCerrado} 
              alt="" 
              className="verPassConfirm" 
              onClick={toggleConfirmPasswordVisibility}/>

              <button className="btn-registro">
                <span>Registrarme</span>
              </button>
              
            </form>
        </div>
      </div>
      
    </>
  );
}
