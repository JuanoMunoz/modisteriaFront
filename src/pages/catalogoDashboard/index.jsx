//mirando
import "./catalogoDashboard.css";
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
  Grid,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit, Eye, AddRounded } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha, Chip } from "@mui/material";
import useCategoriaData from "../../hooks/useCategoriaData";
import useCatalogoData from "../../hooks/useCatalogoData";
import useTallaData from "../../hooks/useTallaData";
import useInsumosData from "../../hooks/useInsumosData";
import { formToCop, imageExtensions } from "../../assets/constants.d";
import { toast, ToastContainer } from "react-toastify";
const CatalogoDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCatalogo,
    watch,
    formState: { errors: errorsAddCatalogo },
    register: registerCatalogo,
    reset,
    setValue,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const {
    initialFetchAllCatalogos,
    loading,
    fetchAllCatalogos,
    deleteCatalogo,
    updateCatalogos,
    createCatalogo,
    createCatalogoInsumos,
  } = useCatalogoData();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedCatalogo, setSelectedCatalogo] = useState(null);
  const [numberOfInsumos, setNumberOfInsumos] = useState([]);
  const [catalogoToDelete, setCatalogoToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [tallas, setTallas] = useState([]);

  const { initialFetchAllCategorias, loading: loadingCategoria } =
    useCategoriaData();
  const { initialFetchAllTallas, loading: loadingTallas } = useTallaData();
  const { initialFetchAllInsumos, loading: loadingInsumos } = useInsumosData();
  const isAnImage = (extension) => {
    return imageExtensions.includes(extension);
  };
  useEffect(() => {
    const initialFetchCatalogo = async () => {
      const respuesta = await initialFetchAllCatalogos();
      const categoria = await initialFetchAllCategorias();
      const tallas = await initialFetchAllTallas();
      const insumos = await initialFetchAllInsumos();
      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data.rows);
      }
      if (categoria.status === 200 && categoria.data) {
        setCategorias(categoria.data);
      }
      if (tallas.status === 200 && tallas.data) {
        setTallas(tallas.data);
      }
      if (insumos.status === 200 && insumos.data) {
        setInsumos(insumos.data);
      }
    };
    initialFetchCatalogo();
  }, []);

  /// Métodos para CRUD
  const handleEdit = (row) => {
    setSelectedCatalogo(row);
    setOpenModal(true);
  };
  const handleAddInsumo = () => {
    if (numberOfInsumos.length >= insumos?.length)
      return toast.error("¡Ya has agregado todos tus insumos!", {
        toastId: "errorAllInsumos",
        autoClose: 1500,
      });
    setValue(
      `insumo[${numberOfInsumos.length}]`,
      insumos[numberOfInsumos.length]?.id
    );
    setNumberOfInsumos((prev) => (!prev ? [1] : [...prev, prev.length + 1]));
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
    const initialBodyCatalogo = {
      producto: "",
      precio: 0,
      categoriaId: 0,
      estadoId: 0,
      tallas: "",
      insumo: [],
      descripcion: "",
      cantidad_utilizada: [],
    };
    setSelectedCatalogo(initialBodyCatalogo);
    reset(initialBodyCatalogo);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setNumberOfInsumos([]);
    setSelectedCatalogo(null);
  };
  const handleSave = async (data) => {
    if (numberOfInsumos.length <= 0)
      return toast.error("¡Debes añadir mínimo un insumo!", {
        toastId: "errorNoInsumosAdded",
        autoClose: 2000,
      });
    const {
      insumo,
      cantidad_utilizada,
      tallas,
      producto,
      precio,
      descripcion,
      categoriaId,
      imagen,
    } = data;
    const tallasNumeros = tallas.map(Number);
    const tallasOrdenadas = tallasNumeros.sort((a, b) => a - b);
    const tallasParsed = tallasOrdenadas.join(",");
    const datosInsumos = [];
    insumo.forEach((insumoId, idx) => {
      datosInsumos.push({
        insumo_id: insumoId,
        cantidad_utilizada: cantidad_utilizada[idx],
      });
    });
    const formDataAddCatalog = new FormData();
    formDataAddCatalog.append("producto", producto);
    formDataAddCatalog.append("precio", precio);
    formDataAddCatalog.append("descripcion", descripcion);
    formDataAddCatalog.append("estadoId", 1);
    formDataAddCatalog.append("categoriaId", categoriaId);
    formDataAddCatalog.append("tallas", tallasParsed);
    formDataAddCatalog.append("file", imagen[0]);
    const response = selectedCatalogo.id
      ? await updateCatalogos(selectedCatalogo.id, formDataAddCatalog)
      : await createCatalogo(formDataAddCatalog);
    if (response.status === 200 || response.status === 201) {
      const id = response.data.data.id;
      const createFichatecnica = await createCatalogoInsumos({
        catalogoId: id,
        datosInsumos,
      });
      const updatedData = await fetchAllCatalogos();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data.rows);
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
  const findMaxQuantityInsumo = (id) => {
    const insumo = insumos.find((insumo) => insumo.id === id);
    return insumo?.cantidad;
  };

  const confirmDelete = async () => {
    if (catalogoToDelete.estadoId === 1) {
      setErrorMessage(
        "No se puede eliminar el producto del catálogo porque está activo."
      );
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    const response = await deleteCatalogo(catalogoToDelete.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((insumo) => insumo.id !== catalogoToDelete.id)
      );
      console.log(response);

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
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      valueGetter: (params) => formToCop(params.row.precio),
    },
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
          checked={row.estadoId == 1}
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ ml: 4 }}>
          Catálogo
        </Typography>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: colors.purple[400],
            "&:hover": {
              backgroundColor: colors.purple[300],
            },
            color: "white",
            mr: "10px",
          }}
        >
          Agregar al catálogo
        </Button>
      </Box>
      {(loading || loadingCategoria || loadingTallas) && <Loading></Loading>}
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
            {selectedCatalogo?.id ? "Editar Catálogo" : "Agregar al Catálogo"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="producto"
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
              {...registerCatalogo("producto", {
                required: "El producto del catálogo necesita un nombre.",
                minLength: {
                  message:
                    "¡El nombre del producto debe tener mínimo 4 caracteres!",
                  value: 4,
                },
                maxLength: {
                  message: "¡Máximo permitido 30 caracteres!",
                  value: 30,
                },
              })}
              value={selectedCatalogo?.producto || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.producto?.message}
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
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
              {...registerCatalogo("descripcion", {
                required: "El producto del catálogo necesita una descripción.",
                minLength: {
                  message:
                    "¡La descripción del producto debe tener mínimo 4 caracteres!",
                  value: 4,
                },
                maxLength: {
                  message: "¡Máximo permitido 100 caracteres!",
                  value: 30,
                },
              })}
              value={selectedCatalogo?.descripcion || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.descripcion?.message}
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
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
              {...registerCatalogo("precio", {
                required: "El precio es requerido",
                pattern: {
                  value: /^[0-9]+$/, // Expresión regular para números
                  message: "Solo se permiten números",
                },
                min: {
                  value: 5000,
                  message: "El precio mínimo de un producto es de $5.000 COP",
                },
                max: {
                  value: 250000,
                  message: "El precio mínimo de un producto es de $250.000 COP",
                },
              })}
              value={selectedCatalogo?.precio || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.precio?.message}
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
              value={
                parseInt(selectedCatalogo?.categoriaId) || categorias[0]?.id
              }
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red", fontSize: ".8rem" } }}
              helperText={errorsAddCatalogo?.categoriaId?.message}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
            <FormControl
              component="fieldset"
              sx={{
                marginTop: "20px",
              }}
            >
              <FormLabel sx={{ color: `${colors.grey[100]}!important` }}>
                Tallas
              </FormLabel>
              <FormGroup
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  sx={{ marginLeft: "5px", marginTop: "10px", mx: "auto" }}
                  container
                  spacing={2}
                >
                  {tallas
                    .sort((a, b) => a.id - b.id)
                    .map((talla) => (
                      <Grid item xs={6} key={talla.id}>
                        <FormControlLabel
                          key={talla.id}
                          control={
                            <Checkbox
                              sx={{
                                color: colors.grey[100],
                                "&.Mui-checked": {
                                  color: colors.purple[300],
                                },
                              }}
                              name="tallas"
                              {...registerCatalogo(`tallas`, {
                                required: "¡Debes elegir mínimo una talla!",
                              })}
                              defaultChecked={
                                selectedCatalogo?.Tallas?.map(
                                  (talla) => talla.id
                                )?.includes(talla.id) || false
                              }
                              onChange={handleInputChange}
                              value={talla.id}
                            />
                          }
                          label={talla.nombre}
                        />
                      </Grid>
                    ))}
                </Grid>
              </FormGroup>
              {errorsAddCatalogo?.tallas && (
                <FormHelperText sx={{ color: "red", fontSize: ".8rem" }}>
                  {errorsAddCatalogo.tallas.message}
                </FormHelperText>
              )}
            </FormControl>
            <DialogTitle sx={{ mt: "10px" }} color={colors.grey[100]}>
              Imagen de referencia
            </DialogTitle>
            <div style={{ width: "100%" }}>
              <label className="subir-img">
                <input
                  {...registerCatalogo("imagen", {
                    required: "La imagen es requerida",
                    validate: () => {
                      return (
                        isAnImage(watch("imagen")[0].name.split(".")[1]) ||
                        "¡Solo se permiten imágenes!"
                      );
                    },
                  })}
                  type="file"
                  accept="image/*"
                />
                <div style={{ width: "100%" }}>{"Subir imagen"}</div>
              </label>
              <DialogTitle sx={{ color: "red", fontSize: ".8rem" }}>
                {errorsAddCatalogo?.imagen?.message}
              </DialogTitle>
            </div>
            <DialogTitle
              sx={{
                mt: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
              color={colors.grey[100]}
            >
              <span>Añadir insumos</span>{" "}
              {numberOfInsumos.length < insumos?.length && (
                <Button onClick={handleAddInsumo}>
                  <AddRounded size={24} color={"#fff"}></AddRounded>
                </Button>
              )}
            </DialogTitle>
            {numberOfInsumos.length >= 1 ? (
              numberOfInsumos.map((idx) => (
                <div
                  style={{ marginTop: "10px" }}
                  key={idx}
                  className="add-insumo-section"
                >
                  <TextField
                    margin="dense"
                    name="insumo"
                    label="Insumo"
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
                    {...registerCatalogo(`insumo[${idx - 1}]`, {
                      required: "Debes escoger un insumo!",
                    })}
                    defaultValue={watch(`insumo[${idx - 1}]`)}
                    onChange={(e) =>
                      setValue(`insumo[${idx - 1}]`, e.target.value)
                    }
                    FormHelperTextProps={{
                      sx: { color: "red", fontSize: ".8rem" },
                    }}
                    helperText={errorsAddCatalogo?.insumo?.[idx - 1]?.message}
                  >
                    {insumos.map((ins) => (
                      <MenuItem key={ins.id} value={ins.id}>
                        {ins.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    margin="dense"
                    name="cantidad_utilizada"
                    label={`Cantidad utilizada (Máximo ${findMaxQuantityInsumo(
                      parseInt(watch(`insumo[${idx - 1}]`))
                    )})`}
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
                    {...registerCatalogo(`cantidad_utilizada[${idx - 1}]`, {
                      required: "¡La cantidad usada es requerida!",
                      pattern: {
                        value: /^[0-9]+$/, // Expresión regular para números
                        message: "Solo se permiten números",
                      },
                      min: {
                        value: 1,
                        message: "¡La cantidad mínima es de 1!",
                      },
                      max: {
                        value: findMaxQuantityInsumo(
                          parseInt(watch(`insumo[${idx - 1}]`))
                        ),
                        message: `¡La cantidad máxima es de ${findMaxQuantityInsumo(
                          parseInt(watch(`insumo[${idx - 1}]`))
                        )}!`,
                      },
                    })}
                    defaultValue={0}
                    onChange={(e) =>
                      setValue(`cantidad_utilizada[${idx - 1}]`, e.target.value)
                    }
                    FormHelperTextProps={{
                      sx: { color: "red", fontSize: ".8rem" },
                    }}
                    helperText={
                      errorsAddCatalogo?.cantidad_utilizada?.[idx - 1]?.message
                    }
                  />
                </div>
              ))
            ) : (
              <div>Dale click a agregar un insumo!</div>
            )}
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
            ¿Estás seguro de que deseas eliminar el producto "
            {catalogoToDelete?.producto}"?
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
        <DialogContent
          sx={{
            paddingTop: 2,
            mt: "20px",
            height: "62vh",
            minWidth: "60vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={1} alignItems="center">
            {/* Imagen del producto */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "80%",
                  borderRadius: "2rem",
                  overflow: "hidden",
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
              >
                {/* Imagen del producto */}
                <img
                  src={selectedCatalogo?.imagen}
                  alt={selectedCatalogo?.producto}
                  style={{ width: "100%", display: "block" }}
                />

                {/* Overlay con texto que aparece al hacer hover */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      padding: "16px",
                    }}
                  >
                    {selectedCatalogo?.producto || "Nombre del producto"}
                  </Typography>
                </Box>
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
                  {formToCop(selectedCatalogo?.precio)} COP
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
      <ToastContainer></ToastContainer>
    </>
  );
};

export default CatalogoDashboard;
