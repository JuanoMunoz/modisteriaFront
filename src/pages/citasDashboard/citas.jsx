import React, { useState } from "react";
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
import { mockDataCita as initialData } from "../../components/data/mockData";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";

const CitasDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para la lista de citas
  const [data, setData] = useState(initialData);

  // Estados para el modal de edición y confirmación de eliminación
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [citaToDelete, setCitaToDelete] = useState(null);

  // Abrir modal de edición
  const handleEdit = (id) => {
    const citaToEdit = data.find((cita) => cita.id === id);
    setSelectedCita(citaToEdit);
    setOpenModal(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpenModal(false);
    setSelectedCita(null);
  };

  // Guardar cambios
  const handleSave = () => {
    setData((prevData) =>
      prevData.map((cita) =>
        cita.id === selectedCita.id ? selectedCita : cita
      )
    );
    setOpenModal(false);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (id) => {
    const cita = data.find((cita) => cita.id === id);
    setCitaToDelete(cita);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCitaToDelete(null);
  };

  // Confirmar eliminación de la cita
  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((cita) => cita.id !== citaToDelete.id)
    );
    setOpenDeleteDialog(false);
    setCitaToDelete(null);
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCita((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fecha", headerName: "Fecha", flex: 1 },
    { field: "metodo_pago", headerName: "Método de Pago", flex: 1 },
    { field: "usuarioId", headerName: "Usuario ID", flex: 1 },
    { field: "objetivo", headerName: "Objetivo", flex: 1 },
    { field: "estado", headerName: "Estado", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button color="primary" onClick={() => handleEdit(params.row.id)}>
            <img
              alt="editar"
              width="20px"
              height="20px"
              src={`../../assets/editar.png`}
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
              src={`../../assets/borrar.png`}
              style={{ cursor: "pointer" }}
            />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="CITAS" subtitle="Lista de Citas para Referencia" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
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
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Modal para editar cita */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Editar Cita</DialogTitle>
        <DialogContent>
          {selectedCita && (
            <>
              <TextField
                label="Fecha"
                name="fecha"
                value={selectedCita.fecha}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Método de Pago"
                name="metodo_pago"
                value={selectedCita.metodo_pago}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Objetivo"
                name="objetivo"
                value={selectedCita.objetivo}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Estado"
                name="estado"
                value={selectedCita.estado}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la cita{" "}
            <strong>{citaToDelete?.objetivo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitasDashboard;
