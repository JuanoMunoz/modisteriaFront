import "./controlInsumos.css";
import Card from "../../components/card/Card";
import { useState, useEffect } from "react";
import Loading from "../../components/loading/Loading";
import useInsumosData from "../../hooks/useInsumosData";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount";
export default function ControlInsumos() {
  const [controlInsumosData, setControlInsumosData] = useState([]);
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const { loadingInsumoHistorial, initialFetchAllInsumosHistory } =
    useInsumosData();
  useEffect(() => {
    const loadInsumosHistory = async () => {
      const response = await initialFetchAllInsumosHistory();
      console.log(response);

      if (response.status === 200) {
        setControlInsumosData(response.data);
        setFilteredData(response.data);
      }
    };
    loadInsumosHistory();
  }, []);
  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  useEffect(() => {
    if (isFirstRender) return;
    console.log(lastModifications);

    if (lastModifications) {
      setFilteredData(controlInsumosData);
    } else {
      const sortedData = [...controlInsumosData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, controlInsumosData]);

  return (
    <>
      {loadingInsumoHistorial && <Loading></Loading>}
      <header className="header">
        <h4>Control de los insumos</h4>
        <div className="header-actions">
          <Button
            variant="contained"
            onClick={handleFilterDataDates}
            color="primary"
            startIcon={<FilterListIcon />}
            endIcon={
              lastModifications ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon></ArrowDownwardIcon>
              )
            }
          >
            {lastModifications ? "Más recientes" : "Más viejas"}
          </Button>
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
