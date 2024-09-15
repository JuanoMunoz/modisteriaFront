import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import JWTProvider from "./context/JWTContext.jsx";
import CartProvider from "./context/CartContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <JWTProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </JWTProvider>
  </BrowserRouter>
);
