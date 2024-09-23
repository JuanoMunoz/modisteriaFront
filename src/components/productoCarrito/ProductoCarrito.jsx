import { useState, useEffect } from "react";
import { Trash } from "../svg/Svg";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import useIsFirstRender from "../../hooks/useIsMount";
export default function ProductoCarrito({ data }) {
  const { removeItem, updateItem } = useCart();
  const { debouncedValue } = useDebounce(data.cantidad, 3000);
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (isFirstRender) return;
    axios
      .put(
        `https://modisteria-back-production.up.railway.app/api/pedidos/updatePedido/${data.idPedido}`,
        {
          cantidad: debouncedValue,
          precioFinal: data.catalogo.precio * data.cantidad,
        }
      )
      .then(() => {})
      .catch((msg) => {
        toast.error(msg, {
          autoClose: 222,
          toastId: "item-add-error",
        });
      });
  }, [debouncedValue]);

  const handleMinusOne = () => {
    if (data.cantidad <= 1) return;
    const newQuantity = data.cantidad - 1;
    const itemChangeQuantity = {
      ...data,
      cantidad: newQuantity,
      precioFinal: data.catalogo.precio * newQuantity,
    };
    updateItem(itemChangeQuantity, data.id);
  };

  const handlePlusOne = () => {
    const newQuantity = data.cantidad + 1;
    const itemChangeQuantity = {
      ...data,
      cantidad: newQuantity,
      precioFinal: data.catalogo.precio * newQuantity,
    };
    updateItem(itemChangeQuantity, data.id);
  };
  const handleRemove = () => {
    removeItem(data.idPedido);
    toast.success("Producto eliminado con éxito", {
      autoClose: 220,
      position: "top-left",
    });
  };
  return (
    <div className="itemCarrito">
      <div className="imgCarrito">
        <img src={data?.catalogo?.imagen} alt="" className="imgCarrito" />
      </div>
      <div className="">
        <span>{data?.catalogo?.producto}</span>
        <span className="idPrenda" style={{ textTransform: "uppercase" }}>
          {data.talla}
        </span>
      </div>
      <span>${data.precioFinal}</span>
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
