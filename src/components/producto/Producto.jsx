import { Fragment, useRef } from "react";
import { useState, useEffect } from "react";
import { Cart, Info } from "../../components/svg/Svg";
import Modal from "../../components/modal/Modal";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import useDecodedJwt from "../../hooks/useJwt";
import axios from "axios";
import { useJwt } from "../../context/JWTContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
export default function Product({ data, isLoading }) {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const { addItem, cartData, updateItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [title, setTitle] = useState("");
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState();
  const [description, setDescription] = useState("");
  const [initialPrice, setInitialPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const listRef = useRef();
  const listRefModal = useRef();
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleMinusOne = () => {
    if (cantidad == 1) return;
    setCantidad(cantidad - 1);
  };
  const handlePlusOne = () => {
    setCantidad(cantidad + 1);
  };
  const handleSetSize = (value) => {
    setSize(value);
  };
  const handleAddToCart = async () => {
    if (!size) {
      if (listRef.current) {
        const buttons = listRef.current.querySelectorAll(".item-list-button");
        buttons.forEach((button) => {
          button.classList.add("alarm");
        });
        setTimeout(() => {
          buttons.forEach((button) => {
            button.classList.remove("alarm");
          });
        }, 1000);
      }
      if (listRefModal.current) {
        const buttons =
          listRefModal.current.querySelectorAll(".item-list-button");
        buttons.forEach((button) => {
          button.classList.add("alarm");
        });
        setTimeout(() => {
          buttons.forEach((button) => {
            button.classList.remove("alarm");
          });
        }, 1000);
      }
      toast.error("Error, selecciona una talla!", {
        autoClose: 700,
        toastId: "error",
      });
      return;
    }
    if (!token) {
      toast.error("Inicia sesión para agregar al carrito!", {
        autoClose: 1000,
        toastId: "item-add",
        onClose: () => {
          navigate("/sesion");
        },
      });
      return;
    }
    const carritoData = {
      idPedido: uuidv4(),
      catalogoId: data.id,
      talla: size,
      precioFinal: finalPrice,
      cantidad: cantidad,
      catalogo: {
        producto: data.producto,
        imagen: data.imagen,
        precio: data.precio,
      },
      usuarioId: payload?.id,
    };
    const itemExistsOnCart = cartData.find(
      (value) =>
        value.catalogoId === carritoData.catalogoId &&
        value.talla === carritoData.talla
    );

    itemExistsOnCart !== undefined
      ? axios
          .put(
            `https://modisteria-back-production.up.railway.app/api/pedidos/updatePedido/${itemExistsOnCart.idPedido}`,
            {
              cantidad: itemExistsOnCart.cantidad + carritoData.cantidad,
              precioFinal:
                itemExistsOnCart.precioFinal + carritoData.precioFinal,
            },
            { headers: { "x-token": token } }
          )
          .then(() => {
            const precioFinalUpdate =
              itemExistsOnCart.precioFinal + carritoData.precioFinal;
            const cantidadFinalUpdate =
              itemExistsOnCart.cantidad + carritoData.cantidad;
            updateItem(
              {
                ...itemExistsOnCart,
                precioFinal: precioFinalUpdate,
                cantidad: cantidadFinalUpdate,
              },
              itemExistsOnCart.id
            ),
              toast.success("Item actualizado con éxito! 😊", {
                autoClose: 222,
                toastId: "updateItem",
              });
          })
          .catch((msg) => {
            toast.error(msg, {
              autoClose: 222,
              toastId: "item-add-error",
              to,
            });
          })
      : axios
          .post(
            "https://modisteria-back-production.up.railway.app/api/pedidos/createPedido",
            carritoData,
            { headers: { "x-token": token } }
          )
          .then(() => {
            addItem(carritoData),
              toast.success("Item agregado con éxito! 😊", {
                autoClose: 222,
              });
          })
          .catch((msg) => {
            toast.error(msg, {
              autoClose: 222,
              toastId: "item-add-error",
            });
          });
  };
  useEffect(() => {
    setFinalPrice(initialPrice * cantidad);
  }, [cantidad, initialPrice]);
  useEffect(() => {
    setTitle(data.producto);
    setSizes(data.talla);
    setDescription(data.descripcion);
    setInitialPrice(data.precio);
  }, []);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        setIsAnimating(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  return (
    <Fragment>
      {" "}
      <div className={`card ${isAnimating ? "show" : ""}`}>
        <div className="image_container">
          <img src={data.imagen} className=" image_container" />
        </div>
        <div className="title">
          <span>{title}</span>
        </div>
        <div className="size">
          <span>Size</span>
          <ul ref={listRef} className="list-size">
            {sizes.map((valueSize, idx) => (
              <li key={idx} className="item-list">
                <button
                  style={{ textTransform: "uppercase" }}
                  onClick={() => {
                    handleSetSize(valueSize);
                  }}
                  className={`item-list-button ${
                    valueSize === size ? "active" : ""
                  }`}
                >
                  {valueSize}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="action">
          <div className="price">
            <span>${finalPrice}</span>
          </div>
          <div className="quantity ">
            <span onClick={handleMinusOne} className="quantity-button">
              -
            </span>
            <span>{cantidad}</span>
            <span onClick={handlePlusOne} className="quantity-button">
              +
            </span>
          </div>
          <button className="btnAccion" onClick={toggleModal}>
            <span>
              <Info></Info>
            </span>
          </button>
          <button onClick={handleAddToCart} className="btnAccion">
            <span>
              <Cart color={"#fff"}></Cart>
            </span>
          </button>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={toggleModal}
        className="modalDetalle"
        customWidth="800px"
      >
        <section className="contenedorDetalle">
          <div className="imageDetalle">
            <img src={data.imagen} className="imageDetalle" />
          </div>
          <div className="infoDetalle">
            <span className="tituloPrenda">{title}</span>
            <hr className="separacionDetalle" />
            <br />
            <span className="precioDetalle">${finalPrice}</span>
            <br />
            <br />
            <div className="detalleDetalle">
              <span>Detalles:</span>
              <p>{description}</p>
            </div>
            <div className="size">
              <span>Talla</span>
              <ul ref={listRefModal} className="list-size">
                {sizes.map((valueSize, idx) => (
                  <li key={idx} className={`item-list`}>
                    <button
                      style={{ textTransform: "uppercase" }}
                      onClick={() => {
                        handleSetSize(valueSize);
                      }}
                      className={`item-list-button ${
                        valueSize === size ? "active" : ""
                      }`}
                    >
                      {valueSize}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="accionesDetalle">
              <div className="quantity-detalle ">
                <span onClick={handleMinusOne} className="quantity-button">
                  -
                </span>
                <span>{cantidad}</span>
                <span onClick={handlePlusOne} className="quantity-button">
                  +
                </span>
              </div>
              <button onClick={handleAddToCart} className="btnAccionDetalle">
                <span>
                  <Cart color={"#fff"}></Cart>
                </span>
              </button>
            </div>
          </div>
        </section>
      </Modal>
    </Fragment>
  );
}
