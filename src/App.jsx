import "./App.css";
import Test from "./components/Text";
import { Routes, Route } from "react-router-dom";
import Error404 from "./pages/Error404";
import Layout from "./components/Layout";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/about" element={<Test />}></Route>
        </Route>
        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
