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
import { mockDataPrenda as initialData } from "../../components/data/mockData";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";

const Prenda = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para la lista de prendas
  const [data, setData] = useState(initialData);

  // Estados para el modal de edición y confirmación de eliminación
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [prendaToDelete, setPrendaToDelete] = useState(null);

  // Abrir modal de edición
  const handleEdit = (id) => {
    const prendaToEdit = data.find((prenda) => prenda.id === id);
    setSelectedPrenda(prendaToEdit);
    setOpenModal(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpenModal(false);
    setSelectedPrenda(null);
  };

  // Guardar cambios
  const handleSave = () => {
    setData((prevData) =>
      prevData.map((prenda) =>
        prenda.id === selectedPrenda.id ? selectedPrenda : prenda
      )
    );
    setOpenModal(false);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (id) => {
    const prenda = data.find((prenda) => prenda.id === id);
    setPrendaToDelete(prenda);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPrendaToDelete(null);
  };

  // Confirmar eliminación del prenda
  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((prenda) => prenda.id !== prendaToDelete.id)
    );
    setOpenDeleteDialog(false);
    setPrendaToDelete(null);
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPrenda((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "talla",
      headerName: "Talla",
      flex: 1,
    },
    {
      field: "imagen",
      headerName: "Imagen",
      flex: 1,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "objetivo",
      headerName: "Objetivo",
      flex: 1,
    },
    {
      field: "citaId",
      headerName: "CitaId",
      flex: 1,
    },
    {
      field: "categoriaId",
      headerName: "CategoriaId",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
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
      <Header title="PrendaS" subtitle="List of Prendas for Future Reference" />
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Modal para editar prenda */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Editar prenda</DialogTitle>
        <DialogContent>
          {selectedPrenda && (
            <>
              <TextField
                label="Nombre"
                name="nombre"
                value={selectedPrenda.nombre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Talla"
                name="talla"
                value={selectedPrenda.talla}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Imagen"
                name="imagen"
                value={selectedPrenda.imagen}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cantidad"
                name="cantidad"
                value={selectedPrenda.cantidad}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Objetivo"
                name="objetivo"
                value={selectedPrenda.objetivo}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CitaId"
                name="citaId"
                value={selectedPrenda.citaId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CategoriaId"
                name="categoriaId"
                value={selectedPrenda.categoriaId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Estado"
                name="estado"
                value={selectedPrenda.estado}
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
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <strong>{prendaToDelete?.producto}</strong>?
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

export default Prenda;
