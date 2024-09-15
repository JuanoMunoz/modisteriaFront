import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const [cartData, setCartData] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );
  const [subtotal, setSubtotal] = useState(0);
  const addItem = (data) => {
    setCartData((prev) => {
      return [...prev, data];
    });
  };
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(cartData));
    setSubtotal(getSubtotal());
  }, [cartData]);
  const getSubtotal = () => {
    return cartData.reduce((a, b) => a + b.finalPrice, 0);
  };
  const updateQuantity = (data, cantidad) => {
    const indexUpdate = cartData.findIndex(
      (value) => data.itemId === value.itemId
    );
    setCartData((prev) => {
      const newCartData = [...prev];
      newCartData[indexUpdate] = {
        ...newCartData[indexUpdate],
        finalPrice: newCartData[indexUpdate].precio * cantidad,
        cantidad: cantidad,
      };
      return newCartData;
    });
  };
  const updateItem = (carritoData) => {
    const indexUpdate = cartData.findIndex(
      (data) => data.id === carritoData.id && data.size === carritoData.size
    );
    setCartData((prev) => {
      const newCartData = [...prev];
      newCartData[indexUpdate] = {
        ...newCartData[indexUpdate],
        finalPrice:
          newCartData[indexUpdate].finalPrice + carritoData.finalPrice,
        cantidad: newCartData[indexUpdate].cantidad + carritoData.cantidad,
      };
      return newCartData;
    });
  };
  const removeItem = (itemId) => {
    setCartData((prev) => prev.filter((value) => value.itemId !== itemId));
  };
  return (
    <CartContext.Provider
      value={{
        addItem,
        cartData,
        removeItem,
        updateItem,
        subtotal,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
