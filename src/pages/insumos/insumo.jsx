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
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Switch,
  styled,
} from "@mui/material";
import "./insumoDashboard.css";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit, AddRounded, Add } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { set, useForm } from "react-hook-form";
import { alpha } from "@mui/material";
import useInsumosData from "../../hooks/useInsumosData";
import useCategoriaDataInsumo from "../../hooks/useCategoriaDataInsumo";
import { toast, ToastContainer } from "react-toastify";
const Insumos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveInsumo,
    formState: { errors: errorsAddInsumo },
    register: registerInsumo,
    reset,
  } = useForm();

  const {
    handleSubmit: handleSaveControlInsumos,
    register: registerControlInsumo,
    setValue,
    watch,
    getValues,
    formState: { errors: errorsAddControlInsumo },
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [insumoToAdd, setInsumoToAdd] = useState();
  const [cantidadesInsumos, setCantidadesInsumos] = useState({});
  const [controlInsumos, setControlInsumos] = useState([]);
  const [openModalReponerInsumos, setOpenModalReponerInsumos] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [insumoToDelete, setInsumoToDelete] = useState(null);
  const [insumoToEditName, setInsumoToEditName] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [availableCategorias, setAvailableCategorias] = useState([]);
  const {
    initialFetchAllInsumos,
    fetchAllInsumos,
    deleteInsumo,
    createInsumo,
    updateInsumos,
    updateCantidadInsumos,
    loading,
  } = useInsumosData();
  const { fetchAllCategorias, loading: loadingCategoria } =
    useCategoriaDataInsumo();
  useEffect(() => {
    const initialFetchInsumos = async () => {
      const respuesta = await initialFetchAllInsumos();
      const categoria = await fetchAllCategorias();

      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      }
      if (categoria.status === 200 && categoria.data) {
        setCategorias(categoria.data);
        setAvailableCategorias(
          categoria.data.filter((cat) => cat.estadoId === 1)
        );
      }
    };
    initialFetchInsumos();
  }, []);

  /// Métodos para CRUD
  const handleEdit = (id) => {
    const insumoToEdit = data.find((insumo) => insumo.id === id);
    setSelectedInsumo(insumoToEdit);
    setInsumoToEditName(insumoToEdit.nombre);
    reset(insumoToEdit);
    setOpenModal(true);
  };
  const handleInsumoToAdd = (e) => {
    setInsumoToAdd(e.target.value);
  };
  const handleChangeCantidadInsumo = (e, idx) => {
    const { value } = e.target;
    const regex = /-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?/;
    if (!regex.test(value) && value !== "") {
      return;
    }
    setCantidadesInsumos((prev) => ({ ...prev, [idx]: value }));
  };

  const addInsumo = () => {
    if (!insumoToAdd)
      return toast.error("¡Debes seleccionar un insumo!", {
        toastId: "addInsumoError",
        autoClose: 1500,
      });
    if (controlInsumos.some((insumo) => insumo.id === insumoToAdd))
      return toast.error("¡Ya has añadido el insumo!", {
        toastId: "addInsumoErrorAlreadyAdded",
        autoClose: 1500,
      });
    const insumo = data.find((insumo) => insumo.id === insumoToAdd);
    setControlInsumos((prev) => prev.concat(insumo));
  };

  const handleStateInsumo = async (e, id) => {
    const isActive = e.target.checked ? 1 : 2;
    const response = await updateInsumos(id, { estadoId: isActive });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllInsumos();

      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
    }
  };
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin Categoría";
  };

  const handleAdd = () => {
    const addNewInsumoBody = {
      nombre: "",
      cantidad: "",
      tipo: "controlado",
      categoriaId: categorias[0]?.id,
      estadoId: 0,
    };
    setSelectedInsumo(addNewInsumoBody);
    reset(addNewInsumoBody);
    setOpenModal(true);
  };
  const handleReponerInsumos = () => {
    setOpenModalReponerInsumos(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedInsumo(null);
  };

  useEffect(() => {
    console.log(errorsAddControlInsumo.cantidadInsumo);
  }, [errorsAddControlInsumo.cantidadInsumo]);

  const saveControlInsumos = async (data) => {
    const insumos = [];

    data.cantidadInsumo.forEach((cantidad, idx) => {
      insumos.push({
        id: controlInsumos[idx].id,
        cantidad:
          data.accionInsumo[idx] === "sumar"
            ? parseInt(cantidad)
            : parseInt(cantidad) * -1,
      });
    });
    const respueta = await updateCantidadInsumos({ insumos });
    if (respueta.status === 201) {
      const updatedData = await fetchAllInsumos();

      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
    }
    console.log(respueta);
  };
  const handleSave = async (data) => {
    const response = selectedInsumo.id
      ? await updateInsumos(selectedInsumo.id, data)
      : await createInsumo({ ...data, estadoId: 1 });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllInsumos();
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
    setInsumoToDelete(insumo);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (insumoToDelete.estadoId === 1) {
      setErrorMessage("No se puede eliminar el insumo porque está activo.");
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    const response = await deleteInsumo(insumoToDelete.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((insumo) => insumo.id !== insumoToDelete.id)
      );
      setOpenDeleteDialog(false);
      setInsumoToDelete(null);
    } else {
      setErrorMessage(response.data.error);
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInsumo((prev) => ({ ...prev, [name]: value }));
  };
  // Fin métodos CRUD
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
    },
    {
      field: "tipo",
      headerName: "Tipo insumo",
      flex: 1,
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ ml: 4 }}>
          Insumos
        </Typography>
        <Box display={"flex"} gap={"5px"}>
          {data.length >= 1 && (
            <Button
              variant="contained"
              onClick={handleReponerInsumos}
              sx={{
                backgroundColor: colors.purple[400],
                "&:hover": {
                  backgroundColor: colors.purple[300],
                },
                color: "white",
                mr: "10px",
              }}
            >
              Reponer insumos
            </Button>
          )}
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
            Nuevo insumo
          </Button>
        </Box>
      </Box>
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
          <Typography>Cargando insumos...</Typography>
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
        <form onSubmit={handleSaveInsumo(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedInsumo?.id ? "Editar Insumo" : "Agregar Insumo"}
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
              {...registerInsumo("nombre", {
                required: "El insumo necesita un nombre.",
                minLength: {
                  message: "¡El insumo debe tener por lo menos 4 caracteres!",
                  value: 4,
                },
                maxLength: {
                  message: "¡El insumo debe tener máximo 15 caracteres!",
                  value: 15,
                },
                validate: {
                  isAlreadyInserted: (value) => {
                    if (selectedInsumo?.id) {
                      return (
                        !data.some(
                          (insumo) =>
                            insumo.nombre.toUpperCase() ==
                              value.toUpperCase() &&
                            insumo.nombre.toUpperCase() !==
                              insumoToEditName.toUpperCase()
                        ) || "El insumo ya se encuentra registrado"
                      );
                    }
                    return (
                      !data.some(
                        (insumo) =>
                          insumo.nombre.toUpperCase() == value.toUpperCase()
                      ) || "El insumo ya se encuentra registrado"
                    );
                  },
                },
              })}
              value={selectedInsumo?.nombre || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddInsumo?.nombre?.message}
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
              {...registerInsumo("cantidad", {
                required: "La cantidad es requerida",
                pattern: {
                  value: /^[0-9]+$/, // Expresión regular para números
                  message: "Solo se permiten números",
                },
                min: {
                  message: "¡Debes ingresar una cantidad mayor a cero!",
                  value: 1,
                },
                max: { message: "¡Límite máximo de 100!", value: 100 },
              })}
              value={selectedInsumo?.cantidad || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddInsumo?.cantidad?.message}
            />
            <TextField
              margin="dense"
              name="tipo"
              label="Tipo insumo"
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
              {...registerInsumo("tipo", {
                required: "¡Debes escoger el tipo del insumo!",
              })}
              value={selectedInsumo?.tipo || "controlado"}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddInsumo?.categoriaId?.message}
            >
              <MenuItem value={"controlado"}>Controlado</MenuItem>
              <MenuItem value={"no controlado"}>No controlado</MenuItem>
            </TextField>
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
              {...registerInsumo("categoriaId", {
                required: "Debes escoger una categoría!",
              })}
              value={
                parseInt(selectedInsumo?.categoriaId) ||
                availableCategorias[0]?.id
              }
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddInsumo?.categoriaId?.message}
            >
              {availableCategorias.map((cat) => (
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
            {insumoToDelete?.nombre}"?
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
      <Dialog
        open={openModalReponerInsumos}
        onClose={() => setOpenModalReponerInsumos(false)}
      >
        <form onSubmit={handleSaveControlInsumos(saveControlInsumos)}>
          <DialogTitle color={colors.grey[100]}>Reponer insumos</DialogTitle>
          <DialogContent>
            <h3>Seleccionar insumo</h3>
            <div className="add-insumo-header">
              {" "}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="labelId">Insumo</InputLabel>
                <Select
                  labelId="labelId"
                  value={insumoToAdd}
                  onChange={handleInsumoToAdd}
                  label="Insumo"
                >
                  {data.map((insumo) => (
                    <MenuItem key={insumo.id} value={insumo.id}>
                      {insumo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={addInsumo} title="Añadir insumo">
                {" "}
                <AddRounded size={24} color={"#fff"}></AddRounded>
              </Button>
            </div>
            <div onSubmit={handleSaveControlInsumos(saveControlInsumos)}>
              <div
                style={{ display: controlInsumos.length ? "flex" : "none" }}
                className="titles-insumos"
              >
                <div className="column">
                  <h4>Insumo</h4>
                </div>
                <div className="column">
                  <h4>Acción</h4>
                </div>
                <div className="column">
                  <h4>Cantidad</h4>
                </div>
              </div>
              {controlInsumos &&
                controlInsumos.map((insumo, idx) => (
                  <div key={insumo.id} className="body-insumos">
                    <h4>{insumo.nombre}</h4>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <Select
                        defaultValue={"sumar"}
                        {...registerControlInsumo(`accionInsumo[${idx}]`)}
                        labelId="demo-customized-select-label"
                        id="demo-customized-select"
                      >
                        <MenuItem value={"sumar"}>Sumar</MenuItem>
                        <MenuItem value={"restar"}>Restar</MenuItem>
                      </Select>
                    </FormControl>
                    <div className="acciones">
                      <span className="quantity-button">-</span>
                      <TextField
                        {...registerControlInsumo(`cantidadInsumo[${idx}]`, {
                          required: `La cantidad de "${insumo.nombre}" es requerida`,
                        })}
                        value={cantidadesInsumos[idx]}
                        margin="dense"
                        onChange={(e) => handleChangeCantidadInsumo(e, idx)}
                        name={`cantidadInsumo[${idx}]`}
                        placeholder="0"
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            textAlign: "center",
                          },
                        }}
                        type="text"
                        variant="standard"
                        sx={{
                          width: "30px",
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
                      <span className="quantity-button">+</span>
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenModalReponerInsumos(false)}
              color="error"
            >
              Cerrar
            </Button>
            <Button type="submit" color="success">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Insumos;
