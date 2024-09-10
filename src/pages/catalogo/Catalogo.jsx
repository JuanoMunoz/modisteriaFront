import "./catalogo.css";
import { useState } from "react";
import Metadata from "../../components/metadata/Metadata";
import Loading from "../../components/loading/Loading";
import useCatalogoData from "../../hooks/useCatalogo";
import Product from "../../components/producto/Producto";
export default function Catalogo() {
  const { fetchCatalagoData, isLoading } = useCatalogoData();
  const [filterPrice, setFilterPrice] = useState(250000);
  const handleFilterPrice = (e) => {
    e.preventDefault();
    if (e.target.value > 250000 || e.target.value < 1) return;
    setFilterPrice(e.target.value);
  };
  console.log(isLoading);
  return (
    <>
      <Metadata title={"Catálogo - Modistería Doña Luz"}></Metadata>
      {isLoading && <Loading></Loading>}
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
          {!isLoading &&
            fetchCatalagoData?.map((data) => (
              <Product key={data.id} isLoading={isLoading} data={data} />
            ))}
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
    </>
  );
}
