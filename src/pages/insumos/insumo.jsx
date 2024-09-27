import React, { useState, useEffect } from "react";  
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Insumos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [insumoToDelete, setInsumoToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await triggerFetch("https://modisteria-back-production.up.railway.app/api/insumos/getAllInsumos", "GET", null, { "x-token": token });
                if (respuesta.status === 200 && respuesta.data) {
                    const insumosConId = respuesta.data.map(insumo => ({
                        ...insumo,
                        id: insumo.id || data.length + 1 
                    }));
                    setData(insumosConId);
                } else {
                    console.error("Error al obtener datos: ", respuesta);
                }
            } catch (error) {
                console.error("Error al realizar la solicitud:", error);
            }
        };
        fetchData();
    }, [triggerFetch, token, data.length]);

    const handleEdit = (id) => {
        const insumoToEdit = data.find((insumo) => insumo.id === id);
        setSelectedInsumo(insumoToEdit);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setSelectedInsumo({ nombre: "", cantidad: "", categoriaId: "", estadoId: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedInsumo(null);
    };

    const handleSave = async () => {
        if (!selectedInsumo.nombre || !selectedInsumo.cantidad) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        try {
            const method = selectedInsumo.id ? "PUT" : "POST";
            const url = selectedInsumo.id 
                ? `https://modisteria-back-production.up.railway.app/api/insumos/updateInsumo/${selectedInsumo.id}`
                : "https://modisteria-back-production.up.railway.app/api/insumos/createInsumo";

            const response = await triggerFetch(url, method, selectedInsumo, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                const insumo = method === "PUT" ? response.data : { ...selectedInsumo, id: data.length + 1 }; 

                setData((prevData) => {
                    if (method === "PUT") {
                        return prevData.map((item) => (item.id === insumo.id ? insumo : item));
                    } else {
                        return [...prevData, insumo]; 
                    }
                });
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
        const insumo = data.find((insumo) => insumo.id === id);
        setInsumoToDelete(insumo);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (insumoToDelete.estadoId === "activo") {
            alert("No se puede eliminar el insumo porque está activo.");
            setOpenDeleteDialog(false);
            return;
        }

        try {
            const response = await triggerFetch(
                `https://modisteria-back-production.up.railway.app/api/insumos/deleteInsumo/${insumoToDelete.id}`,
                "DELETE",
                null,
                { "x-token": token }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Respuesta de eliminación: ", response.data);
                setData((prevData) => prevData.filter((insumo) => insumo.id !== insumoToDelete.id));
                setOpenDeleteDialog(false);
                setInsumoToDelete(null);
            } else {
                console.error("Error inesperado al eliminar datos: ", response.data);
                alert("Error inesperado al eliminar el insumo. Revisa la consola para más información.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedInsumo((prev) => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "nombre", headerName: "Nombre", flex: 1 },
        { field: "cantidad", headerName: "Cantidad", flex: 1 },
        { field: "categoriaId", headerName: "Categoría ID", flex: 1 },
        { field: "estadoId", headerName: "Estado ID", flex: 1 },
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
            <Header title="INSUMOS" subtitle="Lista de insumos" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar Insumo
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
                    <Typography>Cargando insumos...</Typography>
                ) : (
                    <DataGrid 
                        rows={data} 
                        columns={columns} 
                        components={{ Toolbar: GridToolbar }} 
                        getRowId={(row) => row.id} 
                    />
                )}
            </Box>

            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>{selectedInsumo?.id ? "Editar Insumo" : "Agregar Insumo"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedInsumo?.nombre || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="cantidad"
                        label="Cantidad"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedInsumo?.cantidad || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="categoriaId"
                        label="Categoría ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedInsumo?.categoriaId || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="estadoId"
                        label="Estado ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedInsumo?.estadoId || ""}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar el insumo {insumoToDelete?.nombre}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Insumos;
