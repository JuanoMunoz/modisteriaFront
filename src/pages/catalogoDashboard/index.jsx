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

const CatalogoDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, triggerFetch } = useFetch();
  const { token } = useJwt();

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const respuesta = await triggerFetch(
        "https://modisteria-back-production.up.railway.app/api/catalogos/getAllCatalogo",
        "GET"
      );
      if (respuesta.status === 200 && respuesta.data.rows) {
        setData(respuesta.data.rows);
        console.log("Datos cargados: ", respuesta.data.rows);
      } else {
        handleError("Error al obtener datos: " + respuesta);
      }
    };
    fetchData();
  }, [triggerFetch]);

  const handleError = (message) => {
    setErrorMessage(message);
    setOpenErrorModal(true);
  };

  const handleEdit = (id) => {
    const contactToEdit = data.find((contact) => contact.id === id);
    setSelectedContact(contactToEdit);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedContact({
      producto: "",
      precio: "",
      descripcion: "",
      imagen: "",
      talla: "",
      categoriaId: "",
      estadoId: "",
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedContact(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("producto", selectedContact.producto);
      formData.append("precio", selectedContact.precio);
      formData.append("descripcion", selectedContact.descripcion);
      formData.append("talla", selectedContact.talla);
      formData.append("categoriaId", selectedContact.categoriaId);
      formData.append("estadoId", selectedContact.estadoId);
      formData.append("cantidad_utilizada", 0);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const method = selectedContact.id ? "PUT" : "POST";
      const url = selectedContact.id
        ? `https://modisteria-back-production.up.railway.app/api/catalogos/updateCatalogo/${selectedContact.id}`
        : "https://modisteria-back-production.up.railway.app/api/catalogos/createCatalogo";

      const response = await triggerFetch(
        url,
        method,
        formData,
        { "x-token": token, "Content-Type": "multipart/form-data" },
        true
      );

      if (response.status === 200 || response.status === 201) {
        const newProduct = response.data;

        if (method === "POST") {
          const productWithId = { ...selectedContact, id: newProduct.id || Date.now() };
          setData((prevData) => [...prevData, productWithId]);
        } else {
          setData((prevData) =>
            prevData.map((contact) =>
              contact.id === selectedContact.id ? { ...contact, ...selectedContact } : contact
            )
          );
        }

        setOpenModal(false);
        setSelectedContact(null);
        setImageFile(null);
      } else {
        handleError("Error al guardar los datos: " + response.data);
      }
    } catch (error) {
      handleError("Error al realizar la solicitud: " + error.message);
    }
  };

  const handleDelete = (id) => {
    const contact = data.find((contact) => contact.id === id);
    setContactToDelete(contact);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await triggerFetch(
        `https://modisteria-back-production.up.railway.app/api/catalogos/deleteCatalogo/${contactToDelete.id}`,
        "DELETE",
        null,
        { "x-token": token }
      );

      if (response.status === 200 || response.status === 201) {
        setData((prevData) =>
          prevData.filter((contact) => contact.id !== contactToDelete.id)
        );
        setOpenDeleteDialog(false);
        setContactToDelete(null);
      } else {
        handleError("Error inesperado al eliminar datos: " + response.data);
      }
    } catch (error) {
      handleError("Error al realizar la solicitud: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "producto", headerName: "Producto", flex: 1 },
    {
      field: "precio",
      headerName: "Precio",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "imagen", headerName: "Imagen", flex: 1 },
    { field: "talla", headerName: "Talla", flex: 1 },
    { field: "categoriaId", headerName: "Categoría ID", flex: 1 },
    { field: "estadoId", headerName: "Estado ID", flex: 1 },
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
      <Header title="PRODUCTOS" subtitle="Lista de productos del catálogo" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Agregar Producto
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
          <Typography>Cargando productos...</Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>

      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>
          {selectedContact?.id ? "Editar Producto" : "Agregar Producto"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="producto"
            label="Producto"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedContact?.producto || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="precio"
            label="Precio"
            type="number"
            fullWidth
            variant="outlined"
            value={selectedContact?.precio || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedContact?.descripcion || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="talla"
            label="Talla"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedContact?.talla || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="categoriaId"
            label="Categoría ID"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedContact?.categoriaId || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="estadoId"
            label="Estado ID"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedContact?.estadoId || ""}
            onChange={handleInputChange}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
            ¿Estás seguro de que deseas eliminar el producto "
            {contactToDelete?.producto}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
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

export default CatalogoDashboard;
