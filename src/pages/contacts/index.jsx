import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, triggerFetch } = useFetch();
  const { token } = useJwt();

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await triggerFetch(
          "https://modisteria-back-production.up.railway.app/api/usuarios/getAllUsers",
          "GET",
          null,
          { "x-token": token }
        );
        if (respuesta.status === 200 && respuesta.data) {
          const usuariosConId = respuesta.data.map((usuario) => ({
            ...usuario,
            id: usuario.id || data.length + 1,
          }));
          setData(usuariosConId);
        } else {
          setErrorMessage("Error al obtener datos.");
          setOpenErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(
          "Ocurrió un error al obtener los datos. Inténtalo nuevamente."
        );
        setOpenErrorModal(true);
      }
    };
    fetchData();
  }, [triggerFetch, token, data.length]);

  const handleEdit = (id) => {
    const usuarioToEdit = data.find((usuario) => usuario.id === id);
    setSelectedUsuario(usuarioToEdit);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedUsuario({
      nombre: "",
      email: "",
      telefono: "",
      password: "",
      direccion: "",
      roleId: "",
      estadoId: 1,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedUsuario(null);
  };

  const handleSave = async () => {
    try {
      const method = selectedUsuario.id ? "PUT" : "POST";
      const url = selectedUsuario.id
        ? `https://modisteria-back-production.up.railway.app/api/usuarios/updateUser/${selectedUsuario.id}`
        : "https://modisteria-back-production.up.railway.app/api/usuarios/createUsuario";

      const response = await triggerFetch(url, method, selectedUsuario, {
        "x-token": token,
      });

      if (response.status === 200 || response.status === 201) {
        if (method === "PUT") {
          setData((prevData) =>
            prevData.map((usuario) =>
              usuario.id === selectedUsuario.id ? selectedUsuario : usuario
            )
          );
        } else {
          const nuevoUsuario = { ...selectedUsuario, id: data.length + 1 };
          setData((prevData) => [...prevData, nuevoUsuario]);
        }
        handleClose();
      } else {
        setErrorMessage(
          "Error al guardar los datos. Revisa la consola para más detalles."
        );
        setOpenErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        "Ocurrió un error al realizar la solicitud. Inténtalo nuevamente."
      );
      setOpenErrorModal(true);
    }
  };

  const handleDelete = (id) => {
    const usuario = data.find((usuario) => usuario.id === id);
    setUsuarioToDelete(usuario);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await triggerFetch(
        `https://modisteria-back-production.up.railway.app/api/usuarios/deleteUser/${usuarioToDelete.id}`,
        "DELETE",
        null,
        { "x-token": token }
      );

      if (response.status === 200 || response.status === 201) {
        setData((prevData) =>
          prevData.filter((usuario) => usuario.id !== usuarioToDelete.id)
        );
        setOpenDeleteDialog(false);
        setUsuarioToDelete(null);
      } else {
        setErrorMessage(
          "Error inesperado al eliminar el usuario. Revisa la consola para más información."
        );
        setOpenErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        "Ocurrió un error al realizar la solicitud de eliminación. Inténtalo nuevamente."
      );
      setOpenErrorModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    { field: "direccion", headerName: "Dirección", flex: 1 },
    { field: "roleId", headerName: "Role ID", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button color="primary" onClick={() => handleEdit(params.row.id)}>
            <img
              alt="editar"
              width="20px"
              height="20px"
              src="../../assets/editar.png"
              style={{ cursor: "pointer" }}
            />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ ml: 1 }}
          >
            <img
              alt="borrar"
              width="20px"
              height="20px"
              src="../../assets/borrar.png"
              style={{ cursor: "pointer" }}
            />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="USUARIOS" subtitle="Lista de usuarios" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Agregar Usuario
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {loading ? (
          <Typography>Cargando usuarios...</Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>

      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>
          {selectedUsuario?.id ? "Editar Usuario" : "Agregar Usuario"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUsuario?.nombre || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={selectedUsuario?.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="telefono"
            label="Teléfono"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUsuario?.telefono || ""}
            onChange={handleInputChange}
          />
          {!selectedUsuario?.id && (
            <TextField
              margin="dense"
              name="password"
              label="Contraseña"
              type="password"
              fullWidth
              variant="outlined"
              value={selectedUsuario?.password || ""}
              onChange={handleInputChange}
            />
          )}

          <TextField
            margin="dense"
            name="direccion"
            label="Dirección"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUsuario?.direccion || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="roleId"
            label="Role ID"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUsuario?.roleId || ""}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el usuario "
            {usuarioToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
