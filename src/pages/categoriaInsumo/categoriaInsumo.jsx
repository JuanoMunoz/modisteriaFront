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
  Switch,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha } from "@mui/material";
import useCategoriaDataInsumo from "../../hooks/useCategoriaDataInsumo";

const CategoriaInsumo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCategoria,
    formState: { errors: errorsAddCategoria },
    register: registerCategoria,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const {
    fetchAllCategorias,
    loading,
    updateCategoria,
    createCategoria,
    deleteCategoria,
    initialFetchAllCategorias,
  } = useCategoriaDataInsumo();

  useEffect(() => {
    const initialFetchCategorias = async () => {
      const respuesta = await initialFetchAllCategorias();
      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data.filter((c) => c.tipo === "insumo"));
      } else {
        setErrorMessage("Error al cargar las categorías.");
        setOpenErrorModal(true);
      }
    };
    initialFetchCategorias();
  }, []);

  const handleEdit = (id) => {
    const categoriaToEdit = data.find((categoria) => categoria.id === id);
    setSelectedCategoria(categoriaToEdit);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedCategoria({
      nombre: "",
      descripcion: "",
      estadoId: 0,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedCategoria(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCategoria?.id) {
        const respuesta = await updateCategoria(selectedCategoria.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estadoId: selectedCategoria.estadoId,
        });

        if (respuesta.status === 200 || respuesta.status === 201) {
          const updatedData = data.map((categoria) =>
            categoria.id === selectedCategoria.id
              ? { ...categoria, ...formData }
              : categoria
          );
          setData(updatedData);
        } else {
          throw new Error("Error al editar la categoría.");
        }
      } else {
        const respuesta = await createCategoria({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estadoId: 1,
          tipo: "insumo",
        });

        if (respuesta.status === 201) {
          const newCategory = {
            ...respuesta.data,
            estadoId: 1,
            tipo: "insumo",
          };
          if (!newCategory.id) {
            newCategory.id = new Date().getTime();
          }
          setData([...data, newCategory]);
        } else {
          throw new Error("Error al crear la categoría.");
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      setErrorMessage(error.message || "Error al editar la categoría.");
      setOpenErrorModal(true);
    } finally {
      handleClose();
    }
  };

  const handleDelete = (id) => {
    const categoria = data.find((categoria) => categoria.id === id);
    setCategoriaToDelete(categoria);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (categoriaToDelete.estadoId !== 2) {
      setErrorMessage("No se puede eliminar la categoría si está activa.");
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    try {
      const respuesta = await deleteCategoria(categoriaToDelete.id);
      if (respuesta.status === 201) {
        setData(
          data.filter((categoria) => categoria.id !== categoriaToDelete.id)
        );
      } else {
        throw new Error("Error al eliminar la categoría.");
      }
    } catch (error) {
      console.error("Error details:", error);
      setErrorMessage(error.message || "Error al eliminar la categoría.");
      setOpenErrorModal(true);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    {
      field: "estadoId",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }) => (
        <Switch
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.purple[200],
              "&:hover": {
                backgroundColor: alpha(
                  colors.purple[200],
                  theme.palette.action.hoverOpacity
                ),
              },
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.purple[200],
            },
          }}
          color="warning"
          checked={row.estadoId === 1}
          onChange={async (e) => {
            const newState = e.target.checked ? 1 : 2;
            try {
              const respuesta = await updateCategoria(row.id, {
                ...row,
                estadoId: newState,
              });

              if (respuesta.status === 200 || respuesta.status === 201) {
                const updatedData = data.map((categoria) =>
                  categoria.id === row.id
                    ? { ...categoria, estadoId: newState }
                    : categoria
                );
                setData(updatedData);
              } else {
                throw new Error("Error al actualizar el estado.");
              }
            } catch (error) {
              console.error("Error details:", error);
              setErrorMessage(
                error.message || "Error al actualizar el estado."
              );
              setOpenErrorModal(true);
            }
          }}
        />
      ),
    },
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
      <Header
        title="Categorías de Insumos"
        subtitle="Lista de categorías de insumos"
      />
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
        Agregar Categoría
      </Button>
      {loading && <Loading />}
      <Box
        m="0px 20px"
        p="0px 10px"
        height="56vh"
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
          <Typography>Cargando categorías...</Typography>
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
        <form onSubmit={handleSaveCategoria(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedCategoria?.id ? "Editar Categoría" : "Agregar Categoría"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              variant="outlined"
              {...registerCategoria("nombre", {
                required: "El nombre es requerido.",
              })}
              value={selectedCategoria?.nombre || ""}
              onChange={(e) =>
                setSelectedCategoria({
                  ...selectedCategoria,
                  nombre: e.target.value,
                })
              }
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCategoria?.nombre?.message}
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
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              type="text"
              fullWidth
              variant="outlined"
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
              {...registerCategoria("descripcion")}
              value={selectedCategoria?.descripcion || ""}
              onChange={(e) =>
                setSelectedCategoria({
                  ...selectedCategoria,
                  descripcion: e.target.value,
                })
              }
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
            ¿Estás seguro de que deseas eliminar la categoría "
            {categoriaToDelete?.nombre}"?
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

export default CategoriaInsumo;
