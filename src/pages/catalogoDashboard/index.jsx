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
  MenuItem,
  Switch,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit, Eye } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha, Grid, Chip } from "@mui/material";
import useCategoriaData from "../../hooks/useCategoriaData";
import useCatalogoData from "../../hooks/useCatalogoData";
const CatalogoDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCatalogo,
    watch,
    formState: { errors: errorsAddCatalogo },
    register: registerCatalogo,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const {
    initialFetchAllCatalogos,
    loading,
    fetchAllCatalogos,
    deleteCatalogo,
    updateCatalogos,
    createCatalogo,
  } = useCatalogoData();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedCatalogo, setSelectedCatalogo] = useState(null);
  const [catalogoToDelete, setCatalogoToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const { fetchAllCategorias, loading: loadingCategoria } = useCategoriaData();
  useEffect(() => {
    const initialFetchCatalogo = async () => {
      const respuesta = await initialFetchAllCatalogos();
      const categoria = await fetchAllCategorias();

      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data.rows);
      }
      if (categoria.status === 200 && categoria.data) {
        setCategorias(categoria.data);
      }
    };
    initialFetchCatalogo();
  }, []);
  useEffect(() => {
    console.log(selectedCatalogo);
  }, [selectedCatalogo]);

  /// Métodos para CRUD
  const handleEdit = (row) => {
    setSelectedCatalogo(row);
    setOpenModal(true);
  };
  const handlePreview = (row) => {
    setSelectedCatalogo(row);
    setOpenPreview(true);
  };

  const handleStateInsumo = async (e, id) => {
    const isActive = e.target.checked ? 1 : 2;
    const response = await updateCatalogos(id, { estadoId: isActive });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllCatalogos();

      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data.rows);
      }
    }
  };
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin Categoría";
  };

  const handleAdd = () => {
    setSelectedCatalogo({
      nombre: "",
      cantidad: "",
      categoriaId: 0,
      estadoId: 0,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedCatalogo(null);
  };

  const handleSave = async (data) => {
    const response = selectedCatalogo.id
      ? await updateCatalogos(selectedCatalogo.id, data)
      : await createCatalogo({ ...data, estadoId: 1 });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllCatalogos();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
      handleClose();
    } else {
      console.log(response);
    }
  };

  const handleDelete = (id) => {
    const insumo = data.find((insumo) => insumo.id === id);
    setCatalogoToDelete(insumo);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (catalogoToDelete.estadoId === 1) {
      setErrorMessage("No se puede eliminar el insumo porque está activo.");
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    const response = await deleteCatalogo(catalogoToDelete.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((insumo) => insumo.id !== catalogoToDelete.id)
      );
      setOpenDeleteDialog(false);
      setCatalogoToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCatalogo((prev) => ({ ...prev, [name]: value }));
  };
  // Fin métodos CRUD
  const columns = [
    { field: "producto", headerName: "Nombre", flex: 1 },
    { field: "precio", headerName: "Precio", flex: 1 },
    {
      field: "categoriaId",
      headerName: "Categoría",
      flex: 1,
      valueGetter: (params) => getCategoriaNombre(params.row.categoriaId),
    },
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
          onChange={(e) => {
            handleStateInsumo(e, row.id);
          }}
          defaultChecked={row.estadoId == 1}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Box>
          <Button title="ver catálogo" onClick={() => handlePreview(row)}>
            <Eye size={20} color={colors.grey[100]} />
          </Button>
          <Button title="editar" onClick={() => handleEdit(row)}>
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          <Button
            sx={{ marginRight: "10px" }}
            title="borrar"
            onClick={() => handleDelete(row.id)}
          >
            <TrashColor size={20} color={colors.grey[100]} />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Header title="Catálogo" subtitle="Lista del catálogo" />
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
        Agregar al Catálogo
      </Button>
      {(loading || loadingCategoria) && <Loading></Loading>}
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
          <Typography>Cargando catálogo...</Typography>
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
        <form onSubmit={handleSaveCatalogo(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedCatalogo?.id ? "Editar Catálogo" : "Agregar Catálogo"}
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
              {...registerCatalogo("nombre", {
                required: "El insumo necesita un nombre.",
              })}
              value={selectedCatalogo?.nombre || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCatalogo?.nombre?.message}
            />
            <TextField
              margin="dense"
              name="cantidad"
              label="Cantidad"
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
              type="number"
              fullWidth
              variant="outlined"
              {...registerCatalogo("cantidad", {
                required: "La cantidad es requerida",
                pattern: {
                  value: /^[0-9]+$/, // Expresión regular para números
                  message: "Solo se permiten números",
                },
                validate: (value) => {
                  if (value <= 0)
                    return "Debes ingresar una cantidad mayor a cero!";
                  return true;
                },
              })}
              value={selectedCatalogo?.cantidad || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCatalogo?.cantidad?.message}
            />
            <TextField
              margin="dense"
              name="categoriaId"
              label="Categoría"
              fullWidth
              select
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
              {...registerCatalogo("categoriaId", {
                required: "Debes escoger una categoría!",
              })}
              value={parseInt(selectedCatalogo?.categoriaId) || 2}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCatalogo?.categoriaId?.message}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
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
            ¿Estás seguro de que deseas eliminar el insumo "
            {catalogoToDelete?.nombre}"?
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

      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: 16,
            backgroundColor: colors.grey[900],
          },
        }}
      >
        <DialogTitle sx={{ color: colors.grey[100], paddingBottom: 0 }}>
          Visualización previa
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2, mt: "20px", height: "80vh" }}>
          <Grid container spacing={3} alignItems="center">
            {/* Imagen del producto */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  boxShadow: 3,
                  borderRadius: "2rem",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.01)" },
                }}
              >
                <img
                  src={selectedCatalogo?.imagen}
                  alt={selectedCatalogo?.producto}
                  style={{ width: "100%", display: "block" }}
                />
              </Box>
            </Grid>

            {/* Detalles del producto */}
            <Grid item xs={12} sm={6}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedCatalogo?.producto}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ${selectedCatalogo?.precio} COP
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {getCategoriaNombre(selectedCatalogo?.categoriaId)}
              </Typography>

              <Typography variant="body1" color="grey.300" marginTop={2}>
                {selectedCatalogo?.descripcion}
              </Typography>

              {/* Tallas y precio */}
              <Grid container spacing={1} marginTop={3}>
                {selectedCatalogo?.Tallas?.map((talla) => (
                  <Grid item key={talla.id} xs={4}>
                    <Chip
                      label={talla.nombre}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        backgroundColor: colors.purple[300],
                        color: "white",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                onClick={() => setOpenPreview(false)}
                variant="contained"
                sx={{
                  backgroundColor: colors.purple[300],
                  "&:hover": {
                    backgroundColor: colors.purple[200],
                  },
                  color: "white",
                  marginTop: 3,
                }}
              >
                Ver insumos
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingRight: 3 }}>
          <Button
            onClick={() => setOpenPreview(false)}
            color="error"
            variant="contained"
          >
            Cerrar
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

export default CatalogoDashboard;
