import "./controlInsumos.css";
import Card from "../../components/card/Card";
import { useState, useEffect, useRef } from "react";
import useInsumosData from "../../hooks/useInsumosData";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
export default function ControlInsumos() {
  const [controlInsumosData, setControlInsumosData] = useState([]);
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const [inputDateFilter, setInputDateFilter] = useState();
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
  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  const handleSpecificDate = (e) => setInputDateFilter(e.target.value);
  useEffect(() => {
    if (isFirstRender) return;
    if (lastModifications) {
      setFilteredData(controlInsumosData);
    } else {
      const sortedData = [...controlInsumosData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, controlInsumosData]);
  useEffect(() => {
    if (!inputDateFilter) return;
    setFilteredData(controlInsumosData);
  }, [inputDateFilter]);

  return (
    <>
      <header className="header">
        <h4>Control de los insumos</h4>
      </header>

      <div className="filtrosControl">
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
        <div className="textInputWrapper">
          <input
            value={inputDateFilter}
            onChange={handleSpecificDate}
            type="date"
            className="textInput"
          />
        </div>
      </div>

      <main className="main-control-insumo">
        {loadingInsumoHistorial ? (
          <LoadingTableData />
        ) : (
          <Box width={"1000px"} marginLeft={"10%"}>
            {filteredData &&
              filteredData.map((insumoHistory) => (
                <Card
                  key={insumoHistory.id}
                  cantidad={insumoHistory.cantidad_modificada}
                  unidadMedida={insumoHistory.insumos.unidades_de_medida.nombre}
                  autor={insumoHistory.usuario.nombre}
                  tela={insumoHistory.insumos.nombre}
                  fecha={insumoHistory.fecha}
                  correoAutor={insumoHistory.usuario.email}
                  motivo={'"' + insumoHistory.motivo + '"'}
                ></Card>
              ))}
            <br />
          </Box>
        )}
      </main>
    </>
  );
}
