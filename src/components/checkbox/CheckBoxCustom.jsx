import { forwardRef } from "react";
import "./checkobx.css";
const CheckboxCustom = forwardRef(
  ({ checked, permisoName, idPermiso, handlecheckbox, ...props }, ref) => {
    return (
      <div className="checkbox-wrapper-33">
        <label className="checkbox">
          <input
            ref={ref}
            className="checkbox__trigger visuallyhidden"
            type="checkbox"
            checked={checked}
            value={idPermiso}
            onClick={() => handlecheckbox(idPermiso)}
            {...props}
          />
          <span className="checkbox__symbol">
            <svg
              className="icon-checkbox"
              width="28px"
              height="28px"
              viewBox="0 0 28 28"
              version="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 14l8 7L24 7"></path>
            </svg>
          </span>
          <p className="checkbox__textwrapper">{permisoName}</p>
        </label>
      </div>
    );
  }
);
export default CheckboxCustom;
