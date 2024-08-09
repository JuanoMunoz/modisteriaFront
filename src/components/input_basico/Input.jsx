import "./input.css";
import { useState } from "react";
import ojoAbierto from "/ojoAbierto.png";
import ojoCerrado from "/ojoCerrado.png";
export default function Input({ type, placeholder, description, canHidden }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className="input-wrapper">
        <input
          type={canHidden ? (showPassword ? "text" : "password") : type}
          className="input"
          placeholder={placeholder}
        />
        <br />
        <span className="descripcion">{description}</span>
        {canHidden && (
          <>
            <br />
            <img
              src={showPassword ? ojoAbierto : ojoCerrado}
              alt=""
              className="verPass"
              onClick={togglePasswordVisibility}
            />
          </>
        )}
      </div>
    </>
  );
}
