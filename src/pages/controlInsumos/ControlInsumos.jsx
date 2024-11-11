import "./controlInsumos.css";
import Card from "../../components/card/Card";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Loading from "../../components/loading/Loading";
import useInsumosData from "../../hooks/useInsumosData";
export default function ControlInsumos() {
  const [controlInsumosData, setControlInsumosData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { loadingInsumoHistorial, initialFetchAllInsumosHistory } =
    useInsumosData();
  useEffect(() => {
    const loadInsumosHistory = async () => {
      const response = await initialFetchAllInsumosHistory();
      if (response.status === 200) {
        setControlInsumosData(response.data);
        setFilteredData(response.data);
      }
    };
    loadInsumosHistory();
  }, []);

  return (
    <>
      {loadingInsumoHistorial && <Loading></Loading>}
      <header className="header">
        <h4>Control de los insumos</h4>
        <div>
          <Button>holas</Button>
        </div>
      </header>
      <main className="main-control-insumo">
        {filteredData &&
          filteredData.map((insumoHistory) => (
            <Card
              key={insumoHistory.id}
              cantidad={insumoHistory.cantidad_modificada}
              autor={insumoHistory.usuario.nombre}
              tela={insumoHistory.insumos.nombre}
              fecha={insumoHistory.fecha}
              correoAutor={insumoHistory.usuario.email}
              motivo={insumoHistory.motivo}
            ></Card>
          ))}
        <footer className="footer-history">¡Has llegado al final!</footer>
      </main>
    </>
  );
}
