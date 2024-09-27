import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Permisos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPermiso, setSelectedPermiso] = useState(null);
    const [permisoToDelete, setPermisoToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const respuesta = await triggerFetch("https://modisteria-back-production.up.railway.app/api/permisos/getAllPermisos", "GET", null, { "x-token": token });
            if (respuesta.status === 200 && respuesta.data) {
                setData(respuesta.data);
                console.log("Datos cargados: ", respuesta.data);
            } else {
                console.error("Error al obtener datos: ", respuesta);
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    const handleEdit = (id) => {
        const permisoToEdit = data.find((permiso) => permiso.id === id);
        setSelectedPermiso(permisoToEdit);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setSelectedPermiso({ nombre: "", descripcion: "", estadoId: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedPermiso(null);
    };

    const handleSave = async () => {
        try {
            const method = selectedPermiso.id ? "PUT" : "POST";
            const url = selectedPermiso.id 
                ? `https://modisteria-back-production.up.railway.app/api/permisos/updatePermiso/${selectedPermiso.id}`
                : "https://modisteria-back-production.up.railway.app/api/permisos/createPermiso";

            const response = await triggerFetch(url, method, selectedPermiso, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                if (method === "PUT") {
                    setData((prevData) =>
                        prevData.map((permiso) =>
                            permiso.id === selectedPermiso.id ? selectedPermiso : permiso
                        )
                    );
                } else {
                    setData((prevData) => [...prevData, { ...selectedPermiso, id: Date.now() }]);
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
        const permiso = data.find((permiso) => permiso.id === id);
        setPermisoToDelete(permiso);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (permisoToDelete.estadoId === "activo") {
            alert("No se puede eliminar el permiso porque está activo.");
            setOpenDeleteDialog(false);
            return;
        }

        try {
            const response = await triggerFetch(
                `https://modisteria-back-production.up.railway.app/api/permisos/deletePermiso/${permisoToDelete.id}`,
                "DELETE",
                null,
                { "x-token": token }
            );

            if (response.status === 200 || response.status === 201) {
                setData((prevData) => prevData.filter((permiso) => permiso.id !== permisoToDelete.id));
                setOpenDeleteDialog(false);
                setPermisoToDelete(null);
            } else {
                console.error("Error inesperado al eliminar datos: ", response.data);
                alert("Error inesperado al eliminar el permiso. Revisa la consola para más información.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPermiso((prev) => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "nombre", headerName: "Nombre", flex: 1 },
        { field: "descripcion", headerName: "Descripción", flex: 1 },
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
            <Header title="PERMISOS" subtitle="Lista de permisos" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar Permiso
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
                    <Typography>Cargando permisos...</Typography>
                ) : (
                    <DataGrid rows={data} columns={columns} components={{ Toolbar: GridToolbar }} />
                )}
            </Box>

            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>{selectedPermiso?.id ? "Editar Permiso" : "Agregar Permiso"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPermiso?.nombre || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="descripcion"
                        label="Descripción"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPermiso?.descripcion || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="estadoId"
                        label="Estado ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPermiso?.estadoId || ""}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar el permiso "{permisoToDelete?.nombre}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Permisos;
