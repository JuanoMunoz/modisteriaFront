import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const PQRs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPQR, setSelectedPQR] = useState(null);
    const [pqrToDelete, setPqrToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await triggerFetch("https://modisteria-back-production.up.railway.app/api/pqrs/getAllPQRS", "GET", null, { "x-token": token });
                if (respuesta.status === 200 && respuesta.data) {
                    const pqrsConId = respuesta.data.map(pqr => ({
                        ...pqr,
                        id: pqr.id || data.length + 1 
                    }));
                    setData(pqrsConId);
                    console.log("Datos cargados: ", pqrsConId);
                } else {
                    console.error("Error al obtener datos: ", respuesta);
                }
            } catch (error) {
                console.error("Error al realizar la solicitud:", error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    const handleEdit = (id) => {
        const pqrToEdit = data.find((pqr) => pqr.id === id);
        setSelectedPQR(pqrToEdit);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setSelectedPQR({ tipo: "", motivo: "", domicilioId: "", usuarioId: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedPQR(null);
    };

    const handleSave = async () => {
        try {
            const method = selectedPQR.id ? "PUT" : "POST";
            const url = selectedPQR.id 
                ? `https://modisteria-back-production.up.railway.app/api/pqrs/updatePQRS/${selectedPQR.id}`
                : "https://modisteria-back-production.up.railway.app/api/pqrs/createPQRS";

            const response = await triggerFetch(url, method, selectedPQR, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                if (method === "PUT") {
                    setData((prevData) =>
                        prevData.map((pqr) =>
                            pqr.id === selectedPQR.id ? selectedPQR : pqr
                        )
                    );
                } else {
                    const newPQR = { ...selectedPQR, id: data.length + 1 }; 
                    setData((prevData) => [...prevData, newPQR]);
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
        const pqr = data.find((pqr) => pqr.id === id);
        setPqrToDelete(pqr);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await triggerFetch(
                `https://modisteria-back-production.up.railway.app/api/pqrs/deletePQRS/${pqrToDelete.id}`,
                "DELETE",
                null,
                { "x-token": token }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Respuesta de eliminación: ", response.data);
                setData((prevData) => prevData.filter((pqr) => pqr.id !== pqrToDelete.id));
                setOpenDeleteDialog(false);
                setPqrToDelete(null);
            } else {
                console.error("Error inesperado al eliminar datos: ", response.data);
                alert("Error inesperado al eliminar el PQR. Revisa la consola para más información.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPQR((prev) => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "tipo", headerName: "Tipo", flex: 1 },
        { field: "motivo", headerName: "Motivo", flex: 1 },
        { field: "domicilioId", headerName: "Domicilio ID", flex: 1 },
        { field: "usuarioId", headerName: "Usuario ID", flex: 1 },
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
            <Header title="PQRs" subtitle="Lista de PQRs" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar PQR
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
                    <Typography>Cargando PQRs...</Typography>
                ) : (
                    <DataGrid 
                        rows={data} 
                        columns={columns} 
                        components={{ Toolbar: GridToolbar }} 
                    />
                )}
            </Box>

            {/* Modal para Agregar/Editar PQR */}
            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>{selectedPQR?.id ? "Editar PQR" : "Agregar PQR"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="tipo"
                        label="Tipo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPQR?.tipo || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="motivo"
                        label="Motivo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPQR?.motivo || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="domicilioId"
                        label="Domicilio ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPQR?.domicilioId || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="usuarioId"
                        label="Usuario ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPQR?.usuarioId || ""}
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
                    <Typography>¿Estás seguro de que deseas eliminar el PQR con ID "{pqrToDelete?.id}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PQRs;
