import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Roles = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { loading, triggerFetch } = useFetch();
    const { token } = useJwt();

    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedRol, setSelectedRol] = useState(null);
    const [rolToDelete, setRolToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const respuesta = await triggerFetch(
                "https://modisteria-back-production.up.railway.app/api/roles/getAllRoles",
                "GET",
                null,
                { "x-token": token }
            );
            if (respuesta.status === 200 && respuesta.data) {
                const rolesConId = respuesta.data.map(rol => ({
                    ...rol,
                    id: rol.id || data.length + 1 
                }));
                setData(rolesConId);
                console.log("Datos cargados: ", rolesConId);
            } else {
                console.error("Error al obtener datos: ", respuesta);
                setErrorMessage(respuesta.data?.msg || "Error desconocido");
                setOpenErrorDialog(true);
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    const handleEdit = (id) => {
        const rolToEdit = data.find((rol) => rol.id === id);
        setSelectedRol(rolToEdit);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setSelectedRol({ nombre: "", permisosId: [], estadoId: "" });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedRol(null);
    };

    const handleSave = async () => {
        try {
            const method = selectedRol.id ? "PUT" : "POST";
            const url = selectedRol.id 
                ? `https://modisteria-back-production.up.railway.app/api/roles/updateRol/${selectedRol.id}`
                : "https://modisteria-back-production.up.railway.app/api/roles/createRol";

            const response = await triggerFetch(url, method, selectedRol, { "x-token": token });

            if (response.status === 200 || response.status === 201) {
                console.log(response.data.msg);
                if (method === "PUT") {
                    setData((prevData) =>
                        prevData.map((rol) =>
                            rol.id === selectedRol.id ? selectedRol : rol
                        )
                    );
                } else {
                    const newRol = { ...selectedRol, id: Date.now() }; 
                    setData((prevData) => [...prevData, newRol]);
                }
                handleClose();
            } else {
                console.error("Error al guardar los datos: ", response.data);
                setErrorMessage("Error al guardar los datos. Revisa la consola para más detalles.");
                setOpenErrorDialog(true);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            setErrorMessage("Ocurrió un error al realizar la solicitud. Inténtalo nuevamente.");
            setOpenErrorDialog(true);
        }
    };

    const handleDelete = (id) => {
        const rol = data.find((rol) => rol.id === id);
        setRolToDelete(rol);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            console.log("Eliminando rol con ID:", rolToDelete.id);
            const response = await triggerFetch(
                `https://modisteria-back-production.up.railway.app/api/roles/deleteRol/${rolToDelete.id}`,
                "DELETE",
                null,
                { "x-token": token }
            );

            if (response.status === 200 || response.status === 204) {
                console.log("Respuesta de eliminación: ", response.data);
                setData((prevData) => prevData.filter((rol) => rol.id !== rolToDelete.id));
                setOpenDeleteDialog(false);
                setRolToDelete(null);
            } else {
                console.error("Error inesperado al eliminar datos: ", response.data);
                setErrorMessage(response.data.message || "Error inesperado al eliminar el rol. Revisa la consola para más información.");
                setOpenErrorDialog(true);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            setErrorMessage("Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente.");
            setOpenErrorDialog(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "permisosId") {
            const permisosArray = value.split(",").map((permiso) => permiso.trim());
            setSelectedRol((prev) => ({ ...prev, [name]: permisosArray }));
        } else {
            setSelectedRol((prev) => ({ ...prev, [name]: value }));
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "nombre", headerName: "Nombre", flex: 1 },
        { field: "permisosId", headerName: "Permisos ID", flex: 1, valueFormatter: (params) => params.value.join(", ") },
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
            <Header title="ROLES" subtitle="Lista de roles" />
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Agregar Rol
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
                    <Typography>Cargando roles...</Typography>
                ) : (
                    <DataGrid rows={data} columns={columns} components={{ Toolbar: GridToolbar }} />
                )}
            </Box>

            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>{selectedRol?.id ? "Editar Rol" : "Agregar Rol"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedRol?.nombre || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="permisosId"
                        label="Permisos ID (separados por comas)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedRol?.permisosId.join(", ") || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="estadoId"
                        label="Estado ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedRol?.estadoId || ""}
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
                    <Typography>¿Estás seguro de que deseas eliminar el rol "{rolToDelete?.nombre}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography>{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenErrorDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Roles;
