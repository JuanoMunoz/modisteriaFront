import "./catalogo.css";
import { useEffect, useState } from "react";
import Metadata from "../../components/metadata/Metadata";
import Input from "../../components/input_basico/Input";
import Modal from "../../components/modal/Modal";
import { Cart, Info } from "../../components/svg/Svg";

export default function Catalogo() {
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const initialPrice = 20000;
  const [finalPrice, setFinalPrice] = useState(0);
  useEffect(() => {
    setFinalPrice(initialPrice * cantidad);
  }, [cantidad, initialPrice]);
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
  return (
    <>
      <Metadata title={"Catálogo de Productos"}></Metadata>
      <h1>Catálogo</h1>
      <hr className="separacionCatalogo" />
      <section className="contenedorCatalogo">
        <div className="filtros">
          <h4>filtrar por precio</h4>
          <input type="range" className="range-category" />
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
              <span>Camisa del Nacional viva el verde verdolsga</span>
            </div>
            <div className="size">
              <span>Size</span>
              <ul className="list-size">
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
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
              <button className="btnAccion">
                <span>
                  <Cart></Cart>
                </span>
              </button>
              <button className="btnAccion" onClick={toggleModal}>
                <span>
                  <Info></Info>
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
            <span className="tituloPrenda">
              Camisa del Naciona viva el verde verdolaga
            </span>
            <hr className="separacionDetalle" />
            <br />
            <span className="precioDetalle">${finalPrice}</span>
            <br />
            <br />
            <div className="detalleDetalle">
              <span>Detalles:</span>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus, adipisci. Natus corrupti repudiandae suscipit
                accusamus voluptas quas sapiente
              </p>
            </div>
            <div className="size">
              <span>Talla</span>
              <ul className="list-size">
                <li className="item-list">
                  <button className="item-list-button">37</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">38</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">39</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">40</button>
                </li>
                <li className="item-list">
                  <button className="item-list-button">41</button>
                </li>
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
