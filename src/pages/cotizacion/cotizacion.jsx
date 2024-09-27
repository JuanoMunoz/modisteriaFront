import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Cotizacion = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [cotizacionToDelete, setCotizacionToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                console.error("No se ha proporcionado un token.");
                return;
            }

            const respuesta = await triggerFetch(
                "https://modisteria-back-production.up.railway.app/api/cotizaciones/getAllCotizaciones",
                "GET",
                null,
                { "x-token": token }
            );

            if (respuesta.status === 200 && respuesta.data) {
                const cotizacionesConId = respuesta.data.map(cotizacion => ({
                    ...cotizacion,
                    id: cotizacion.id || data.length + 1 
                }));
                setData(cotizacionesConId);
                console.log("Datos cargados: ", cotizacionesConId);
            } else {
                console.error("Error al obtener datos: ", respuesta);
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    const handleEdit = (id) => {
        const cotizacionToEdit = data.find((cotizacion) => cotizacion.id === id);
        setSelectedCotizacion(cotizacionToEdit);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setSelectedCotizacion({ estadoId: "", imagen: "", nombrePersona: "", valorDomicilio: "", valorPrendas: "", valorFinal: "", pedidoId: "", metodoPago: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedCotizacion(null);
    };

    const handleSave = async () => {
        try {
            const method = selectedCotizacion.id ? "PUT" : "POST";
            const url = selectedCotizacion.id 
                ? `https://modisteria-back-production.up.railway.app/api/cotizaciones/updateCotizacion/${selectedCotizacion.id}`
                : "https://modisteria-back-production.up.railway.app/api/cotizaciones/createCotizacion";

            const response = await triggerFetch(url, method, selectedCotizacion, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                if (response.data.msg) {
                    console.log(response.data.msg);
                    if (method === "PUT") {
                        setData((prevData) =>
                            prevData.map((cotizacion) =>
                                cotizacion.id === selectedCotizacion.id ? selectedCotizacion : cotizacion
                            )
                        );
                    } else {
                        const newCotizacion = { ...selectedCotizacion, id: data.length + 1 }; 
                        setData((prevData) => [...prevData, newCotizacion]);
                    }
                }
                handleClose();
            } else {
                console.error("Error al guardar los datos: ", response.data);
                alert("Error al guardar los datos. Revisa la consola para más detalles.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error al realizar la solicitud. Inténtalo nuevamente.");
        }
    };

    const handleDelete = (id) => {
        const cotizacion = data.find((cotizacion) => cotizacion.id === id);
        setCotizacionToDelete(cotizacion);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await triggerFetch(
                `https://modisteria-back-production.up.railway.app/api/cotizaciones/deleteCotizacion/${cotizacionToDelete.id}`,
                "DELETE",
                null,
                { "x-token": token }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Respuesta de eliminación: ", response.data);
                setData((prevData) => prevData.filter((cotizacion) => cotizacion.id !== cotizacionToDelete.id));
                setOpenDeleteDialog(false);
                setCotizacionToDelete(null);
            } else {
                console.error("Error inesperado al eliminar datos: ", response.data);
                alert("Error inesperado al eliminar la cotización. Revisa la consola para más información.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCotizacion((prev) => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "estadoId", headerName: "Estado ID", flex: 1 },
        { field: "imagen", headerName: "Imagen", flex: 1 },
        { field: "nombrePersona", headerName: "Nombre Persona", flex: 1 },
        { field: "valorDomicilio", headerName: "Valor Domicilio", flex: 1 },
        { field: "valorPrendas", headerName: "Valor Prendas", flex: 1 },
        { field: "valorFinal", headerName: "Valor Final", flex: 1 },
        { field: "pedidoId", headerName: "Pedido ID", flex: 1 },
        { field: "metodoPago", headerName: "Método de Pago", flex: 1 },
        {
            field: "acciones",
            headerName: "Acciones",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button color="primary" onClick={() => handleEdit(params.row.id)}>
                        <img alt="editar" width="20px" height="20px" src="../../assets/editar.png" style={{ cursor: "pointer" }} />
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)} sx={{ ml: 1 }}>
                        <img alt="borrar" width="20px" height="20px" src="../../assets/borrar.png" style={{ cursor: "pointer" }} />
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="COTIZACIONES" subtitle="Lista de cotizaciones" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar Cotización
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
                    <Typography>Cargando cotizaciones...</Typography>
                ) : (
                    <DataGrid 
                        rows={data} 
                        columns={columns} 
                        components={{ Toolbar: GridToolbar }} 
                    />
                )}
            </Box>

            {/* Modal para Agregar/Editar Cotización */}
            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>{selectedCotizacion?.id ? "Editar Cotización" : "Agregar Cotización"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="estadoId"
                        label="Estado ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.estadoId || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="imagen"
                        label="Imagen"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.imagen || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="nombrePersona"
                        label="Nombre Persona"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.nombrePersona || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="valorDomicilio"
                        label="Valor Domicilio"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.valorDomicilio || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="valorPrendas"
                        label="Valor Prendas"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.valorPrendas || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="valorFinal"
                        label="Valor Final"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.valorFinal || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="pedidoId"
                        label="Pedido ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.pedidoId || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="metodoPago"
                        label="Método de Pago"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedCotizacion?.metodoPago || ""}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar la cotización "{cotizacionToDelete?.pedidoId}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Cotizacion;
