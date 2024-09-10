import { Fragment } from "react";
import { useState, useEffect } from "react";
import { Cart, Info } from "../../components/svg/Svg";
import Modal from "../../components/modal/Modal";
export default function Product({ data, isLoading }) {
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [title, setTitle] = useState("");
  const [sizes, setSizes] = useState([]);
  const [description, setDescription] = useState("");
  const [initialPrice, setInitialPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
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
  const handleAddToCart = () => {};
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
          <ul className="list-size">
            {sizes.map((size, idx) => (
              <li key={idx} className="item-list">
                <button className="item-list-button">{size}</button>
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
        customWidth="1000px"
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
              <ul className="list-size">
                {sizes.map((size, idx) => (
                  <li key={idx} className="item-list">
                    <button className="item-list-button">{size}</button>
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
              <button className="btnAccionDetalle">
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
