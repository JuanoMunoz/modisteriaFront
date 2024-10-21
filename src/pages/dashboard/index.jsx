import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header/Header";
import BarChart from "../../components/BarChart/BarChart";
import StatBox from "../../components/StatBox/StatBox";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, triggerFetch } = useFetch();
  const { token } = useJwt();

  const [ventas, setVentas] = useState([]);
  const [pqrs, setPqrs] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ventasResponse = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/ventas/getAllVentas",
        "GET",
        null,
        { "x-token": token }
      );
      if (ventasResponse.status === 200) {
        setVentas(ventasResponse.data);
      }

      const pqrsResponse = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/pqrs/getAllPQRS",
        "GET",
        null,
        { "x-token": token }
      );
      if (pqrsResponse.status === 200) {
        setPqrs(pqrsResponse.data);
      }

      const usuariosResponse = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/usuarios/getAllUsers",
        "GET",
        null,
        { "x-token": token }
      );
      if (usuariosResponse.status === 200) {
        setUsuarios(usuariosResponse.data);
      }

      const cotizacionesResponse = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/cotizaciones/getAllCotizaciones",
        "GET",
        null,
        { "x-token": token }
      );
      if (cotizacionesResponse.status === 200) {
        setCotizaciones(cotizacionesResponse.data);
      }

      const insumosResponse = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/insumos/getAllInsumos",
        "GET",
        null,
        { "x-token": token }
      );
      if (insumosResponse.status === 200) {
        setInsumos(insumosResponse.data);
      }
    };

    fetchData();
  }, [triggerFetch, token]);

  return (
    <div style={{ margin: " 0 20px", boxSizing: "border-box", height: "55vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Bienvenid@ a tu dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <EmailIcon sx={{ color: colors.purple[200], fontSize: "26px" }} />
            <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
              {pqrs.length}
            </Typography>
            <Typography
              variant="h6"
              color={colors.purple[500]}
              fontWeight="600"
            >
              PQRs pendientes por revisar
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <PointOfSaleIcon
              sx={{ color: colors.purple[200], fontSize: "26px" }}
            />
            <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
              {ventas.length}
            </Typography>
            <Typography
              variant="h6"
              color={colors.purple[500]}
              fontWeight="600"
            >
              Cantidad ventas realizadas
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <PersonAddIcon
              sx={{ color: colors.purple[200], fontSize: "26px" }}
            />
            <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
              {usuarios.length}
            </Typography>
            <Typography
              variant="h6"
              color={colors.purple[500]}
              fontWeight="600"
            >
              Usuarios registrados
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <TrafficIcon sx={{ color: colors.purple[200], fontSize: "26px" }} />
            <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
              {cotizaciones.length}
            </Typography>
            <Typography
              variant="h6"
              color={colors.purple[500]}
              fontWeight="600"
            >
              Cotizaciones pendientes
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          mb="0px"
        >
          <Box
            mt="0px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Insumos disponibles
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {loading ? (
              <p>Cargando datos...</p>
            ) : (
              <BarChart data={insumos} isDashboard={true} />
            )}
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          mb="20px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              PQRS Recientes
            </Typography>
          </Box>
          {pqrs.map((pqr, i) => (
            <Box
              key={`${pqr.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box flexGrow={1} display="flex" justifyContent="center">
                <Typography
                  color={colors.purple[200]}
                  variant="h5"
                  fontWeight="600"
                >
                  {pqr.tipo}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} flexBasis="40%">
                <Typography>{pqr.motivo}</Typography>
              </Box>
              <Box color={colors.grey[100]}>{pqr.fecha}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box mt="20px" />
    </div>
  );
};

export default Dashboard;
