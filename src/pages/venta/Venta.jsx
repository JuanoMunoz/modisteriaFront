import "./venta.css";
import Metadata from "../../components/metadata/Metadata";
import { useJwt } from "../../context/JWTContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDecodedJwt from "../../hooks/useJwt";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input_basico/Input";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useActiveUserInfo from "../../hooks/useActiveUserInfo";
export default function Venta() {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const [elegirPago, setElegirPago] = useState(false);
  const [formaPago, setFormaPago] = useState("");
  const { cartData, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(false);
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useActiveUserInfo(payload?.id);
  const [domicilio, setDomicilio] = useState();
  const [showFullQr, setShowFullQr] = useState(false);
  const handleChangeAddress = (e) => {
    setLugarEntrega(e.target.value);
  };
  const handleChangePayMethod = (e) => {
    setFormaPago(e.target.value);
  };
  const addressToggle = () => {
    setAddress(!address);
  };
  const qrToggle = () => {
    setShowFullQr(!showFullQr);
  };
  console.log(lugarEntrega);

  const handleAddressSubmit = async (data) => {
    setLoading(true);
    setAddress(false);
    const direccionString = `${data.tipoCalle} ${data.calle} ${data.numero1}${data.numero2} ${data.infoAdicional}`;
    axios
      .put(
        `https://modisteria-back-production.up.railway.app/api/usuarios/updateUser/${payload?.id}`,
        { direccion: direccionString }
      )
      .then(() => {
        toast.success("Dirección agregada con éxito! ", {
          autoClose: 800,
          toastId: "direccion-ok",
        });
        axios
          .get(
            `https://modisteria-back-production.up.railway.app/api/usuarios/getUserById/${payload?.id}`
          )
          .then((res) => {
            setUserData(res.data);
            setDomicilio(15000);
          });
      })
      .catch(() => {
        toast.error("Error al añadir dirección! ", {
          autoClose: 800,
          toastId: "direccion-mal",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (userData?.direccion) {
      setDomicilio(15000);
    } else {
      setDomicilio(null);
    }
  }, [userData]);

  useEffect(() => {
    if (lugarEntrega === "domicilio") return setTotal(subtotal + domicilio);
    setTotal(subtotal);
  }, [lugarEntrega, subtotal, domicilio]);
  const [total, setTotal] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    formState: { errors: errorsForm2 },
  } = useForm();

  const handleTransferencia = (data) => {
    console.log(data);
  };
  useEffect(() => {
    (!token || cartData.length == 0) && navigate("/");
  }, [token, cartData, navigate]);

  const handlePassPayMethod = () => {
    if (lugarEntrega === "domicilio" && !userData?.direccion) {
      setAddress(true);
      return;
    }
    if (lugarEntrega !== "domicilio" && lugarEntrega !== "modisteria") return;
    setElegirPago(true);
  };
  return (
    <>
      <Metadata title={"Venta - Modisteria Doña Luz"}></Metadata>
      {loading && <Loading></Loading>}
      <section className="venta-section">
        <article className={`recogida ${elegirPago ? "" : "activo"}`}>
          <h2>Elige la forma de entrega</h2>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="entrega"
                  value="domicilio"
                  onChange={handleChangeAddress}
                  checked={lugarEntrega === "domicilio"}
                />
                <span className="input-text">Enviar a domicilio</span>
              </div>
              {userData?.direccion ? (
                <h4 className="info-adicional">Carrera 67 a #109</h4>
              ) : (
                <h4 onClick={addressToggle} className="info-agregar-direccion">
                  Agregar dirección
                </h4>
              )}
            </div>
            <div className="price-choice">
              {userData?.direccion ? (
                <span>${domicilio}</span>
              ) : (
                <span>Por definir</span>
              )}
            </div>
          </label>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  onChange={handleChangeAddress}
                  className="radio-styles"
                  name="entrega"
                  value="modisteria"
                  checked={lugarEntrega === "modisteria"}
                />
                <span className="input-text">Recoger en la Modisteria</span>
              </div>
              <h4 className="info-adicional">
                Calle 43 #34 - 195 int 306 - Copacabana
              </h4>
            </div>
            <div className="price-choice">
              <span>Sin costo</span>
            </div>
          </label>
          <button onClick={handlePassPayMethod} className="boton-continuar">
            Continuar
          </button>
        </article>
        <article className={`recogida ${elegirPago ? "" : "activo"}`}>
          <h2>Elige la forma de pago</h2>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="pago"
                  value="efectivo"
                  onChange={handleChangePayMethod}
                  checked={formaPago === "efectivo"}
                />
                <span className="input-text">Pagar en efectivo 💵</span>
              </div>
              <h4 className="info-adicional" style={{ color: "#808080" }}>
                *Ten el dinero a la mano
              </h4>
            </div>
            <div className="price-choice"></div>
          </label>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  onChange={handleChangePayMethod}
                  className="radio-styles"
                  name="pago"
                  value="transferencia"
                  checked={formaPago === "transferencia"}
                />
                <span className="input-text">Pagar por transferencia</span>
              </div>
              <div className="tipos-transferencia">
                <img
                  alt="bancolombia logo"
                  title="Bancolombia"
                  src="https://seeklogo.com/images/B/bancolombia-logo-932DD4816B-seeklogo.com.png"
                />
                <img
                  src="https://static.wixstatic.com/media/60a29b_ff944fc332d24bf9b7e861543c9d9854~mv2.png/v1/fill/w_318,h_318,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/nequi-logo.png"
                  alt="nequi logo"
                  title="Nequi"
                />
              </div>
            </div>
            <div className="price-choice">
              <span>
                <img
                  className="qr-img"
                  onClick={qrToggle}
                  src="https://static.vecteezy.com/system/resources/previews/013/722/213/non_2x/sample-qr-code-icon-png.png"
                  alt="qr"
                  title="Qr Doña Luz"
                />
              </span>
            </div>
          </label>
          <button onClick={handlePassPayMethod} className="boton-continuar">
            Continuar
          </button>
        </article>
        <article className="ficha-tecnica">
          <div>
            {" "}
            <h3 className="resumen-compra-title">Resumen de mi compra</h3>
            <hr className="separacion-resumen" />
          </div>
          <div className="ficha-productos">
            {cartData.map((value) => (
              <div key={value.itemId} className="ficha-producto">
                <div>
                  {value.producto}{" "}
                  <span className="talla-producto">{value.size}</span>
                </div>
                <span>x{value.cantidad}</span>
              </div>
            ))}
          </div>
          <div className="info-ficha-tecnica">
            <div className="info-price-ficha-tecnica">
              {" "}
              <span>Subtotal:</span>
              <span>${subtotal} COP</span>
            </div>
            <div className="info-price-ficha-tecnica">
              <span>Total:</span>
              <span>${total ? total : subtotal} COP</span>
            </div>
          </div>
        </article>
      </section>
      <Modal customWidth={"800px"} onClose={addressToggle} show={address}>
        <form onSubmit={handleSubmit(handleAddressSubmit)}>
          <h2 className="add-address-title">Agregar dirección 📍</h2>
          <hr className="separacion" />
          <div className="address-modal">
            <label>
              <h3 className="text-label">Tipo de Calle</h3>
              <div className="select-wrapper">
                <select
                  {...register("tipoCalle", { required: true })}
                  defaultValue={"Carrera"}
                  className="tipocalle-select"
                  name=""
                  id=""
                >
                  <option value="Avenida">Avenida</option>
                  <option value="Calle">Calle</option>
                  <option value="Carrera">Carrera</option>
                  <option value="Diagonal">Diagonal</option>
                  <option value="Circular">Circular</option>
                  <option value="Circunvalar">Circunvalar</option>
                  <option value="Transversal">Transversal</option>
                  <option value="Vía">Vía</option>
                  <option value="">9</option>
                  <option value="">10</option>
                  <option value="">11</option>
                  <option value="">12</option>
                </select>
              </div>
              <Input
                {...register("calle", {
                  maxLength: 5,
                  required: "obligado",
                  pattern: {
                    value: /^\d+[a-zA-Z]?$/,
                    message: "no está bien hecho",
                  },
                })}
                error={errors.calle}
                placeholder={"Ej. 67A "}
              ></Input>
            </label>
            <label className="label-number-address">
              <h3 className="text-label">Número</h3>
              <div className="number-address">
                {" "}
                <Input
                  {...register("numero1", {
                    maxLength: 4,
                    required: true,
                    pattern: { value: /^#\d+/ },
                  })}
                  placeholder={"Ej. #34"}
                  width={"3rem"}
                  description={""}
                  error={errors.numero1}
                ></Input>
                <Input
                  placeholder={"Ej. -195"}
                  width={"3rem"}
                  {...register("numero2", {
                    maxLength: 4,
                    required: true,
                    pattern: { value: /^-\d+/ },
                  })}
                  error={errors.numero2}
                ></Input>
              </div>
            </label>
          </div>
          <div className="">
            <label className="piso-depto">
              <h3 className="text-label">Piso/Departamento (Opcional)</h3>
              <Input
                {...register("infoAdicional", {
                  maxLength: 40,
                })}
                width={"rem"}
                placeholder={"Ej. int 201 torre 2"}
                error={errors.infoAdicional}
              ></Input>
            </label>
          </div>
          <button type="submit" className="agregar-direccion">
            Agregar
          </button>
        </form>
      </Modal>
      <Modal onClose={qrToggle} show={showFullQr}>
        <form
          onSubmit={handleSubmitForm2(handleTransferencia)}
          className="modal-qr"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/013/722/213/non_2x/sample-qr-code-icon-png.png"
            alt="qr"
            title="Qr Doña Luz"
          />
          <div>
            <Input
              {...registerForm2("nroComprobante", {
                required: true,
                maxLength: 10,
                minLength: 10,
              })}
              placeholder={"Nro. Comprobante"}
              error={errorsForm2.nroComprobante}
            ></Input>

            <Input
              {...registerForm2("valorEnviado", {
                required: true,
                validate: (value) => value == total,
              })}
              placeholder={"Valor enviado"}
              error={errorsForm2.valorEnviado}
            ></Input>
            {errorsForm2.valorEnviado &&
              toast.error(
                "El valor enviado debe ser igual al total de la venta!"
              )}
          </div>
          <button type="submit" className="agregar-direccion">
            Enviar Comprobante
          </button>
        </form>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
