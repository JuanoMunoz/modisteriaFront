//mirando
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
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import useTallaData from "../../hooks/useTallaData";
const Tallas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveTalla,
    formState: { errors: errorsAddTalla },
    register: registerTalla,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTalla, setselectedTalla] = useState(null);
  const [tallaToDelete, settallaToDelete] = useState(null);
  const [tallaToEditName, setTallaToEditName] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const {
    initialFetchAllTallas,
    fetchAllTallas,
    deleteTalla,
    createTalla,
    updateTalla,
    loading,
  } = useTallaData();
  useEffect(() => {
    const initialFetchTallas = async () => {
      const respuesta = await initialFetchAllTallas();
      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      }
    };
    initialFetchTallas();
  }, []);

  /// Métodos para CRUD
  const handleEdit = (id) => {
    const tallaToEdit = data.find((talla) => talla.id === id);
    setselectedTalla(tallaToEdit);
    setTallaToEditName(tallaToEdit.nombre);
    reset(tallaToEdit);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setselectedTalla({
      nombre: "",
    });
    reset({ nombre: "" });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setselectedTalla(null);
  };

  const handleSave = async (data) => {
    const dataParsed = { nombre: data.nombre.toUpperCase() };
    const response = selectedTalla.id
      ? await updateTalla(selectedTalla.id, dataParsed)
      : await createTalla({ ...dataParsed, estadoId: 1 });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllTallas();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
      handleClose();
    } else {
      console.log(response);
    }
  };

  const handleDelete = (id) => {
    const talla = data.find((talla) => talla.id === id);
    settallaToDelete(talla);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const response = await deleteTalla(tallaToDelete.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((talla) => talla.id !== tallaToDelete.id)
      );
      setOpenDeleteDialog(false);
      settallaToDelete(null);
    } else {
      setOpenDeleteDialog(false);
      setErrorMessage(response.data.message);
      setOpenErrorModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setselectedTalla((prev) => ({ ...prev, [name]: value }));
  };
  // Fin métodos CRUD
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "tipo", headerName: "Tipo", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button onClick={() => handleEdit(row.id)}>
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          <Button onClick={() => handleDelete(row.id)} sx={{ ml: 1 }}>
            <TrashColor size={20} color={colors.grey[100]} />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Header title="Tallas" subtitle="Lista de tallas" />
      <Button
        variant="contained"
        onClick={handleAdd}
        sx={{
          mb: 2,
          backgroundColor: colors.purple[400],
          "&:hover": {
            backgroundColor: colors.purple[300],
          },
          color: "white",
        }}
      >
        Agregar Talla
      </Button>
      {loading && <Loading></Loading>}
      <Box
        m="0px 20px"
        p="0px 10px"
        height="56%"
        width="98%"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.purple[500],
            borderBottom: "none",
            color: "white",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[200],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.purple[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {loading ? (
          <Typography>Cargando tallas...</Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </Box>

      <Dialog open={openModal} onClose={handleClose}>
        <form onSubmit={handleSaveTalla(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedTalla?.id ? "Editar Talla" : "Agregar Talla"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              variant="outlined"
              {...registerTalla("nombre", {
                required: "La talla necesita un nombre.",
                maxLength: {
                  message: "¡La talla solo puede tener hasta 4 caracteres!",
                  value: 4,
                },
                validate: {
                  isAlreadyInserted: (value) => {
                    if (selectedTalla?.id) {
                      return (
                        !data.some(
                          (talla) =>
                            talla.nombre.toUpperCase() == value.toUpperCase() &&
                            talla.nombre.toUpperCase() !== tallaToEditName
                        ) || "La talla ya se encuentra registrada"
                      );
                    }
                    return (
                      !data.some(
                        (talla) =>
                          talla.nombre.toUpperCase() == value.toUpperCase()
                      ) || "La talla ya se encuentra registrada"
                    );
                  },
                },
              })}
              value={selectedTalla?.nombre || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddTalla?.nombre?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancelar
            </Button>
            <Button type="submit" color="success">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle color={colors.grey[100]}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la Talla "
            {tallaToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
        <DialogTitle color={colors.grey[100]}>Error</DialogTitle>
        <DialogContent>
          <Typography color={colors.grey[100]}>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)} color="error">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Tallas;
