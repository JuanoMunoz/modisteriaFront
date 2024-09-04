import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import JWTProvider from "./context/JWTContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <JWTProvider>
      <App />
    </JWTProvider>
  </BrowserRouter>
);
