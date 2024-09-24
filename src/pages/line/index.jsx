// Line.jsx
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import LineChart from "../../components/LineChart/LineChart";
import { mockLineDataVentas } from "../../components/data/mockData"; // Asegúrate de la ruta correcta

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Ventas por Fecha" />
      <Box height="75vh">
        <LineChart data={mockLineDataVentas} />
      </Box>
    </Box>
  );
};

export default Line;
