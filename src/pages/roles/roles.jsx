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
  Switch,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormControl,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { TrashColor, Edit, Eye } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha } from "@mui/material";
import useRolData from "../../hooks/useRolData";
import usePermisosData from "../../hooks/usePermisosData";
const Roles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveRol,
    watch: watchSaveRol,
    reset,
    setFocus,
    formState: { errors: errorsAddRol },
    register: registerRol,
  } = useForm();
  const {
    initialFetchAllroles,
    fetchAllroles,
    updaterol,
    createrol,
    deleterol,
    loading,
  } = useRolData();
  const { fetchAllPermisos, loading: loadingpermisos } = usePermisosData();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPermisosModal, setOpenPermisosModal] = useState(false);
  const [selectedRol, setselectedRol] = useState(null);
  const [rolToDelete, setrolToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [permisos, setPermisos] = useState([]);
  useEffect(() => {
    const initialFetchRoles = async () => {
      const respuesta = await initialFetchAllroles();
      const permiso = await fetchAllPermisos();

      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      }
      if (permiso.status === 200 && permiso.data) {
        setPermisos(permiso.data);
      }
    };
    initialFetchRoles();
  }, []);

  /// Métodos para CRUD
  const handleEdit = (id) => {
    const rolToEdit = data.find((rol) => rol.id === id);
    setselectedRol(rolToEdit);
    setOpenModal(true);
    setFocus("nombre");
  };
  const handlePermission = (id) => {
    const rolToEdit = data.find((rol) => rol.id === id);
    setselectedRol(rolToEdit);
    setOpenPermisosModal(true);
  };

  const handleStateRol = async (e, id) => {
    const isActive = e.target.checked ? 1 : 2;
    const response = await updaterol(id, { estadoId: isActive });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllroles();

      if (
        (updatedData.status === 200 || updatedData.status === 201) &&
        updatedData.data
      ) {
        setData(updatedData.data);
      } else {
        console.log(updatedData);
      }
    } else {
      console.log(response);
    }
  };

  const handleAdd = () => {
    setselectedRol({
      nombre: "",
      permisosId: [],
    });
    setOpenModal(true);
    setFocus("nombre");
  };

  const handleClose = () => {
    setOpenModal(false);
    reset({
      permisosId: [],
    });
    setselectedRol(null);
  };

  const handleSave = async (data) => {
    const bodyData = {
      ...data,
      permisosId: data.permisosId.map((permisoId) => parseInt(permisoId)),
    };

    const response = selectedRol.id
      ? await updaterol(selectedRol.id, bodyData)
      : await createrol({ ...bodyData, estadoId: 1 });
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllroles();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
      handleClose();
    } else {
      console.log(response);
    }
  };

  const handleDelete = (id) => {
    const rol = data.find((rol) => rol.id === id);
    setrolToDelete(rol);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (rolToDelete.estadoId === 1) {
      setErrorMessage("No se puede eliminar el rol porque está activo.");
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }

    const response = await deleterol(rolToDelete?.id);

    if (response.status === 200 || response.status === 201) {
      setData((prevData) =>
        prevData.filter((rol) => rol.id !== rolToDelete.id)
      );
      setOpenDeleteDialog(false);
      setrolToDelete(null);
    } else {
      setErrorMessage(response?.data?.message);
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "permisosId") {
      if (checked) {
        setselectedRol((prev) => ({
          ...prev,
          permisosId: [...prev.permisosId, value],
        }));
      } else {
        setselectedRol((prev) => ({
          ...prev,
          permisosId: prev.permisosId.filter((id) => id !== value),
        }));
      }
    } else {
      setselectedRol((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fin métodos CRUD
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    {
      field: "permisosId",
      headerName: "Permisos",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            handlePermission(row.id);
          }}
        >
          <Eye size={20} color={colors.grey[100]}></Eye>
        </Button>
      ),
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
            handleStateRol(e, row.id);
          }}
          defaultChecked={row.estadoId == 1}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) =>
        row.nombre !== "ADMINISTRADOR" ? (
          <Box sx={{ textAlign: "center", mx: "auto" }}>
            <Button onClick={() => handleEdit(row.id)}>
              <Edit size={20} color={colors.grey[100]} />
            </Button>
            <Button onClick={() => handleDelete(row.id)} sx={{ ml: 1 }}>
              <TrashColor size={20} color={colors.grey[100]} />
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mx: "auto" }}>
            <h4>Sin acciones</h4>
          </Box>
        ),
    },
  ];

  return (
    <>
      <Header title="Roles" subtitle="Lista de roles" />
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
        Agregar Rol
      </Button>
      {(loading || loadingpermisos) && <Loading></Loading>}
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
          <Typography>Cargando roles...</Typography>
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
        <form onSubmit={handleSaveRol(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedRol?.id ? "Editar Rol" : "Agregar Rol"}
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
              {...registerRol("nombre", {
                required: "El rol necesita un nombre.",
              })}
              value={selectedRol?.nombre || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddRol?.nombre?.message}
            />
            <FormControl
              component="fieldset"
              sx={{
                marginTop: "20px",
              }}
            >
              <FormLabel sx={{ color: `${colors.grey[100]}!important` }}>
                Permisos
              </FormLabel>
              <FormGroup>
                <Grid
                  sx={{ marginLeft: "5px", marginTop: "10px" }}
                  container
                  spacing={2}
                >
                  {permisos.map((permiso, idx) => (
                    <Grid item xs={6} key={permiso.id}>
                      <FormControlLabel
                        key={permiso.id}
                        control={
                          <Checkbox
                            sx={{
                              color: colors.grey[100],
                              "&.Mui-checked": {
                                color: colors.purple[300],
                              },
                            }}
                            name="permisosId"
                            {...registerRol(`permisosId`, {
                              required: "¡Debes elegir mínimo un permiso!",
                            })}
                            defaultChecked={
                              selectedRol?.permisosId.includes(permiso.id) ||
                              false
                            }
                            onChange={handleInputChange}
                            value={permiso.id}
                          />
                        }
                        label={permiso.nombre}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
              {errorsAddRol?.permisosId && (
                <FormHelperText sx={{ color: "red" }}>
                  {errorsAddRol.permisosId.message}
                </FormHelperText>
              )}
            </FormControl>
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
        open={openPermisosModal}
        onClose={() => setOpenPermisosModal(false)}
      >
        <DialogTitle fontSize={"24px"} color={colors.grey[100]}>
          Permisos
        </DialogTitle>
        <DialogContent>
          <List sx={{ marginRight: "200px" }}>
            {selectedRol?.permisosId.map((permisoId, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={
                    permisos.find((permiso) => permiso.id === permisoId)?.nombre
                  }
                  secondary={`Id: ${permisoId}`}
                ></ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermisosModal(false)} color="error">
            cerrar
          </Button>
        </DialogActions>
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
            ¿Estás seguro de que deseas eliminar el rol "{rolToDelete?.nombre}"?
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

export default Roles;
