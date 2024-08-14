import "./input.css";
import { forwardRef, useState } from "react";
import ojoAbierto from "/ojoAbierto.png";
import ojoCerrado from "/ojoCerrado.png";
// eslint-disable-next-line react/display-name
const Input = forwardRef(
  ({ type, placeholder, description, canHidden, color, ...props }, ref) => {
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
            ref={ref}
            {...props}
          />
          <br />
          <span style={{ color: color }} className="descripcion">
            {description}
          </span>
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
);
export default Input;