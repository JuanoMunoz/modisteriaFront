import "./venta.css";
import Metadata from "../../components/metadata/Metadata";
import { useJwt } from "../../context/JWTContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Venta() {
  const { token } = useJwt();
  const { cartData } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    (!token || cartData.length == 0) && navigate("/");
  }, [token, cartData, navigate]);
  console.log(token);
  return (
    <>
      <Metadata title={"Venta - Modisteria Doña Luz"}></Metadata>
      <section className="venta-section">
        <article className="recogida">
          <h2>Elige la forma de entrega</h2>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="entrega"
                  id="domicilio"
                />
                <span className="input-text">Enviar a domicilio</span>
              </div>
              <h4 className="info-adicional">Carrera 67 a #109</h4>
            </div>
            <div className="price-choice">
              <span>$235000</span>
            </div>
          </label>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="entrega"
                  id="domicilio"
                />
                <span className="input-text">Recoger en la Modisteria</span>
              </div>
              <h4 className="info-adicional">Carrera 67 a #109</h4>
            </div>
            <div className="price-choice">
              <span>$235000</span>
            </div>
          </label>
          <button className="boton-continuar">Continuar</button>
        </article>
        <article className="ficha-tecnica">
          <div>Ficha técnica</div>
        </article>
      </section>
    </>
  );
}
