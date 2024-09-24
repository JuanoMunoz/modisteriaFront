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
import { mockDataVentas as initialData } from "../../components/data/mockData";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";

const Ventas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para la lista de ventas
  const [data, setData] = useState(initialData);

  // Estados para el modal de edición y confirmación de eliminación
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [ventaToDelete, setVentaToDelete] = useState(null);

  // Abrir modal de edición
  const handleEdit = (id) => {
    const ventaToEdit = data.find((venta) => venta.id === id);
    setSelectedVenta(ventaToEdit);
    setOpenModal(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpenModal(false);
    setSelectedVenta(null);
  };

  // Guardar cambios
  const handleSave = () => {
    setData((prevData) =>
      prevData.map((venta) =>
        venta.id === selectedVenta.id ? selectedVenta : venta
      )
    );
    setOpenModal(false);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (id) => {
    const venta = data.find((venta) => venta.id === id);
    setVentaToDelete(venta);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setVentaToDelete(null);
  };

  // Confirmar eliminación de la venta
  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((venta) => venta.id !== ventaToDelete.id)
    );
    setOpenDeleteDialog(false);
    setVentaToDelete(null);
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVenta((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "precio",
      headerName: "Precio",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1,
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
    },
    {
      field: "categoriaId",
      headerName: "CategoriaId",
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
      <Header title="Ventas" subtitle="Lista de Ventas" />
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

      {/* Modal para editar Venta */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Editar Venta</DialogTitle>
        <DialogContent>
          {selectedVenta && (
            <>
              <TextField
                label="Producto"
                name="producto"
                value={selectedVenta.producto}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Precio"
                name="precio"
                value={selectedVenta.precio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="cliente"
                name="cliente"
                value={selectedVenta.cliente}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Categoria ID"
                name="categoriaId"
                value={selectedVenta.categoriaId}
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
            ¿Estás seguro de que deseas eliminar la venta{" "}
            <strong>{ventaToDelete?.producto}</strong>?
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

export default Ventas;
