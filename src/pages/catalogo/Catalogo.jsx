import "./catalogo.css";
import { useEffect, useState } from "react";
import Metadata from "../../components/metadata/Metadata";
import Modal from "../../components/modal/Modal";
import { Cart, Info } from "../../components/svg/Svg";
export default function Catalogo() {
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [title] = useState("Camiseta del Nacional");
  const [sizes] = useState(["37", "38", "39", "40", "41"]);
  const [filterPrice, setFilterPrice] = useState(250000);
  const [description] = useState(
    "Muestra tu pasión por el fútbol y tu lealtad al equipo con la Camisa Oficial del Atlético Nacional 2024. Diseñada para los verdaderos hinchas, esta camiseta combina la elegancia del verde y blanco con la más alta tecnología en tejido deportivo."
  );
  const handleAddToCart = () => {};
  const initialPrice = 20000;
  const [finalPrice, setFinalPrice] = useState(0);
  useEffect(() => {
    setFinalPrice(initialPrice * cantidad);
  }, [cantidad, initialPrice]);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleFilterPrice = (e) => {
    e.preventDefault();
    if (e.target.value > 250000 || e.target.value < 1) return;
    setFilterPrice(e.target.value);
  };
  const handleMinusOne = () => {
    if (cantidad == 1) return;
    setCantidad(cantidad - 1);
  };
  const handlePlusOne = () => {
    setCantidad(cantidad + 1);
  };
  return (
    <>
      <Metadata title={"Catálogo de Productos"}></Metadata>
      <h1>Catálogo</h1>
      <hr className="separacionCatalogo" />
      <section className="contenedorCatalogo">
        <div className="filtros">
          <h4>filtrar por precio</h4>
          <h3>${filterPrice} COP</h3>
          <input
            type="range"
            value={filterPrice}
            min={1}
            onChange={handleFilterPrice}
            max={250000}
            className="range-category"
          />
        </div>
        <div className="catalogo">
          {/*CARTA DEL PRODUCTO*/}
          <div className="card">
            <div className="image_container">
              <img
                src="https://eldeportivo.com.co/wp-content/uploads/2023/01/Polemica-precio-camiseta-Atletico-Nacional-2023-1.png"
                className=" image_container"
              />
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
                  <Cart></Cart>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PAGINADOR */}
      <div className="cPaginador">
        <ul className="paginador">
          <li>
            <a href="#">Previous</a>
          </li>
          <li>
            <a href="#">1</a>
          </li>
          <li>
            <a href="#">2</a>
          </li>
          <li>
            <a href="#">3</a>
          </li>
          <li>
            <a href="#">4</a>
          </li>
          <li>
            <a href="#">5</a>
          </li>
          <li>
            <a href="#">6</a>
          </li>
          <li>
            <a href="#">7</a>
          </li>
          <li>
            <a href="#">8</a>
          </li>
          <li>
            <a href="#">Next</a>
          </li>
        </ul>
      </div>

      {/* MODAL */}
      <Modal
        show={showModal}
        onClose={toggleModal}
        className="modalDetalle"
        customWidth="1000px"
      >
        <section className="contenedorDetalle">
          <div className="imageDetalle">
            <img
              src="https://eldeportivo.com.co/wp-content/uploads/2023/01/Polemica-precio-camiseta-Atletico-Nacional-2023-1.png"
              className="imageDetalle"
            />
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
                  <Cart></Cart>
                </span>
              </button>
            </div>
          </div>
        </section>
      </Modal>
    </>
  );
}
