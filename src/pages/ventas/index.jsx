import React, { useState, useEffect } from "react"; 
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Ventas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [newVenta, setNewVenta] = useState({ fecha: "", cotizacionId: "", estadoId: "" });

    useEffect(() => {
        const fetchData = async () => {
            const respuesta = await triggerFetch("https://modisteria-back-production.up.railway.app/api/ventas/getAllVentas", "GET", null, { "x-token": token });
            if (respuesta.status === 200 && respuesta.data) {
                setData(respuesta.data);
                console.log("Datos cargados: ", respuesta.data);
            } else {
                console.error("Error al obtener datos: ", respuesta);
                if (respuesta.status === 401) {
                    setErrorMessage("No autorizado: verifica el token.");
                    setErrorModalOpen(true);
                }
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    const handleAdd = () => {
        setNewVenta({ fecha: "", cotizacionId: "", estadoId: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleErrorClose = () => {
        setErrorModalOpen(false);
    };

    const handleSave = async () => {
        try {
            const response = await triggerFetch("https://modisteria-back-production.up.railway.app/api/ventas/createVenta", "POST", newVenta, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                console.log(response.data.msg);
                setData((prevData) => [...prevData, { ...newVenta, id: Date.now() }]); 
                handleClose();
            } else {
                console.error("Error al guardar los datos: ", response.data);
                setErrorMessage("Error al guardar los datos. Revisa la consola para más detalles.");
                setErrorModalOpen(true);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            setErrorMessage("Ocurrió un error al realizar la solicitud. Inténtalo nuevamente.");
            setErrorModalOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVenta((prev) => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "fecha", headerName: "Fecha", flex: 1 },
        { field: "cotizacionId", headerName: "Cotización ID", flex: 1 },
        { field: "estadoId", headerName: "Estado ID", flex: 1 },
    ];

    return (
        <Box m="20px">
            <Header title="VENTAS" subtitle="Lista de ventas" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar Venta
            </Button>
            <Box m="40px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
                "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
                "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
            }}>
                {loading ? (
                    <Typography>Cargando ventas...</Typography>
                ) : (
                    <DataGrid rows={data} columns={columns} components={{ Toolbar: GridToolbar }} />
                )}
            </Box>

            {/* Modal para Agregar Venta */}
            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>Agregar Venta</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="fecha"
                        label="Fecha"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={newVenta.fecha}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="cotizacionId"
                        label="Cotización ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newVenta.cotizacionId}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="estadoId"
                        label="Estado ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newVenta.estadoId}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorModalOpen} onClose={handleErrorClose}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography>{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Ventas;
