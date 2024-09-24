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
import { mockDataInsumo as initialData } from "../../components/data/mockData";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";

const Insumo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para la lista de insumos
  const [data, setData] = useState(initialData);

  // Estados para el modal de edición y confirmación de eliminación
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [insumoToDelete, setInsumoToDelete] = useState(null);

  // Abrir modal de edición
  const handleEdit = (id) => {
    const insumoToEdit = data.find((insumo) => insumo.id === id);
    setSelectedInsumo(insumoToEdit);
    setOpenModal(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpenModal(false);
    setSelectedInsumo(null);
  };

  // Guardar cambios
  const handleSave = () => {
    setData((prevData) =>
      prevData.map((insumo) =>
        insumo.id === selectedInsumo.id ? selectedInsumo : insumo
      )
    );
    setOpenModal(false);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (id) => {
    const insumo = data.find((insumo) => insumo.id === id);
    setInsumoToDelete(insumo);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setInsumoToDelete(null);
  };

  // Confirmar eliminación del insumo
  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((insumo) => insumo.id !== insumoToDelete.id)
    );
    setOpenDeleteDialog(false);
    setInsumoToDelete(null);
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInsumo((prev) => ({ ...prev, [name]: value }));
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
      field: "cantidad",
      headerName: "Cantidad",
      type: "number",
      headerAlign: "left",
      align: "left",
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
      <Header title="InsumoS" subtitle="List of Insumos for Future Reference" />
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

      {/* Modal para editar insumo */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Editar insumo</DialogTitle>
        <DialogContent>
          {selectedInsumo && (
            <>
              <TextField
                label="Nombre"
                name="nombre"
                value={selectedInsumo.nombre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cantidad"
                name="cantidad"
                value={selectedInsumo.cantidad}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Categoria ID"
                name="categoriaId"
                value={selectedInsumo.categoriaId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Estado"
                name="estado"
                value={selectedInsumo.estado}
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
            <strong>{insumoToDelete?.producto}</strong>?
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

export default Insumo;
