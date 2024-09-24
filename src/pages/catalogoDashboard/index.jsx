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
import { mockDataCatalogo as initialData } from "../../components/data/mockData";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";

const CatalogoDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para la lista de contactos
  const [data, setData] = useState(initialData);

  // Estados para el modal de edición y confirmación de eliminación
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Abrir modal de edición
  const handleEdit = (id) => {
    const contactToEdit = data.find((contact) => contact.id === id);
    setSelectedContact(contactToEdit);
    setOpenModal(true);
  };

  // Cerrar modal de edición
  const handleClose = () => {
    setOpenModal(false);
    setSelectedContact(null);
  };

  // Guardar cambios
  const handleSave = () => {
    setData((prevData) =>
      prevData.map((contact) =>
        contact.id === selectedContact.id ? selectedContact : contact
      )
    );
    setOpenModal(false);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (id) => {
    const contact = data.find((contact) => contact.id === id);
    setContactToDelete(contact);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setContactToDelete(null);
  };

  // Confirmar eliminación del contacto
  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((contact) => contact.id !== contactToDelete.id)
    );
    setOpenDeleteDialog(false);
    setContactToDelete(null);
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedContact((prev) => ({ ...prev, [name]: value }));
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
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1,
    },
    {
      field: "imagen",
      headerName: "Imagen",
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
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
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

      {/* Modal para editar contacto */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Editar Contacto</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <>
              <TextField
                label="Producto"
                name="producto"
                value={selectedContact.producto}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Precio"
                name="precio"
                value={selectedContact.precio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Descripcion"
                name="descripcion"
                value={selectedContact.descripcion}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Imagen"
                name="imagen"
                value={selectedContact.imagen}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Categoria ID"
                name="categoriaId"
                value={selectedContact.categoriaId}
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
            <strong>{contactToDelete?.producto}</strong>?
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

export default CatalogoDashboard;
