import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useJwt } from "./JWTContext";
import useDecodedJwt from "../hooks/useJwt";
import { json } from "react-router-dom";
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const [cartData, setCartData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const addItem = (data) => {
    setCartData((prev) => {
      return [...prev, data];
    });
  };
  useEffect(() => {
    axios
      .get(
        `https://modisteria-back-production.up.railway.app/api/pedidos/getPedidoById/${payload?.id}`,
        { headers: { "x-token": token } }
      )
      .then((res) => {
        setCartData(res.data);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(cartData));
    setSubtotal(getSubtotal());
  }, [cartData]);
  const getSubtotal = () => {
    return cartData.reduce((a, b) => a + b.precioFinal, 0);
  };
  const updateItem = (carritoData, id) => {
    const indexUpdate = cartData.findIndex((data) => data.id === id);
    setCartData((prev) => {
      const newCartData = [...prev];
      newCartData[indexUpdate] = carritoData;
      return newCartData;
    });
  };
  const removeItem = (idPedido) => {
    setCartData((prev) => prev.filter((value) => value.idPedido !== idPedido));
    axios.delete(
      `https://modisteria-back-production.up.railway.app/api/pedidos/deletePedido/${idPedido}`,
      { headers: { "x-token": token } }
    );
  };
  return (
    <CartContext.Provider
      value={{
        addItem,
        cartData,
        removeItem,
        updateItem,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
