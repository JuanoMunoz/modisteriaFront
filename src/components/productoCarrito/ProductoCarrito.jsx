import { useState, useEffect } from "react";
import { Trash } from "../svg/Svg";
import { useCart } from "../../context/CartContext";
export default function ProductoCarrito({ data }) {
  const { removeItem, updateQuantity, cartData } = useCart();
  const [cantidad, setCantidad] = useState(data.cantidad);
  const handleMinusOne = () => {
    if (cantidad == 1) return;
    setCantidad(cantidad - 1);
  };
  useEffect(() => {
    setCantidad(data.cantidad);
  }, [data.cantidad]);
  useEffect(() => {
    updateQuantity(data, cantidad);
  }, [cantidad]);

  const handlePlusOne = () => {
    setCantidad(cantidad + 1);
  };
  const handleRemove = () => {
    removeItem(data.itemId);
  };
  return (
    <div className="itemCarrito">
      <div className="imgCarrito">
        <img src={data.imagen} alt="" className="imgCarrito" />
      </div>
      <div className="">
        <span>{data.producto}</span>
        <span className="idPrenda" style={{ textTransform: "uppercase" }}>
          {data.size}
        </span>
      </div>
      <span>${data.finalPrice}</span>
      <div className="amount">
        <span onClick={handleMinusOne} className="quantity-button">
          -
        </span>
        <span>{data.cantidad}</span>
        <span onClick={handlePlusOne} className="quantity-button">
          +
        </span>
      </div>

      <div onClick={handleRemove} className="trash">
        <Trash size={25}></Trash>
      </div>
    </div>
  );
}
