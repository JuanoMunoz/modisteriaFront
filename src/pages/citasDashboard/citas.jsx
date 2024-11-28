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
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import useCitasData from "../../hooks/useCitasData";
import { formatDateSpanish, formaTime } from "../../assets/constants.d";
import {
  ShoppingCartOutlined,
  ViewListOutlined,
  AdminPanelSettingsOutlined,
  LockOutlined,
  Inventory2Outlined,
  StyleOutlined,
  CalendarTodayOutlined,
  InventoryOutlined,
  HelpOutlineOutlined,
  StraightenOutlined,
  HistoryOutlined,
  Settings,
  TableChart,
  BarChart,
  PointOfSale,
} from "@mui/icons-material";

const CitasDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCita,
    formState: { errors: errorsEditCita },
    register: registerCita,
    reset,
  } = useForm();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const {
    loading,
    updateCita,
    deleteCita,
    createCita,
    initialFetchAllCitas,
    initialFetchAllUsuarios,
  } = useCitasData();

  useEffect(() => {
    const initialFetchCitasAndUsuarios = async () => {
      const respuestaCitas = await initialFetchAllCitas();
      const respuestaUsuarios = await initialFetchAllUsuarios();
      if (respuestaCitas.status === 200 && respuestaCitas.data) {
        setData(respuestaCitas.data);
      } else {
        setErrorMessage("Error al cargar las citas.");
      }
      if (respuestaUsuarios.status === 200 && respuestaUsuarios.data) {
        setUsuarios(respuestaUsuarios.data);
      } else {
        setErrorMessage("Error al cargar los usuarios.");
      }
    };
    initialFetchCitasAndUsuarios();
  }, []);

  const handleEdit = (id) => {
    const citaToEdit = data.find((cita) => cita.id === id);
    setSelectedCita(citaToEdit);
    reset(citaToEdit);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedCita(null);
  };

  const handleSave = async (formData) => {
    const fechaIso = new Date(formData.fecha).toISOString();

    const maxId =
      data.length > 0 ? Math.max(...data.map((cita) => cita.id)) : 0;
    const newId = maxId + 1;

    const dataToSend = {
      ...formData,
      fecha: fechaIso,
      id: newId,
    };

    console.log("Datos enviados a la API:", dataToSend);

    try {
      const respuestaCitas = await (selectedCita
        ? updateCita(selectedCita.id, dataToSend)
        : createCita(dataToSend));

      if (respuestaCitas.status === 200 || respuestaCitas.status === 201) {
        const updatedData = selectedCita
          ? data.map((cita) =>
              cita.id === selectedCita.id ? { ...cita, ...dataToSend } : cita
            )
          : [...data, dataToSend];

        setData(updatedData);
        await initialFetchAllUsuarios();
        handleClose();
      } else {
        throw new Error(
          respuestaCitas.data.message || "Error al guardar la cita."
        );
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message || "Error al guardar la cita.");
    }
  };

  const handleDelete = (id) => {
    const cita = data.find((cita) => cita.id === id);
    setCitaToDelete(cita);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (
      citaToDelete.estadoId !== 9 &&
      citaToDelete.estadoId !== 10 &&
      citaToDelete.estadoId !== 11
    ) {
      setErrorMessage("Solo se pueden eliminar citas inactivas o canceladas.");
      setOpenDeleteDialog(false);
      return;
    }
    const respuestaCitas = await deleteCita(citaToDelete.id);
    if (respuestaCitas.status === 201) {
      setData(data.filter((cita) => cita.id !== citaToDelete.id));
      setOpenDeleteDialog(false);
      setCitaToDelete(null);
    } else {
      setErrorMessage(respuestaCitas.data.message);
      setOpenDeleteDialog(false);
    }
  };

  const getUsuarioNombre = (usuarioId) => {
    const usuario = usuarios.find((user) => user.id === usuarioId);
    return usuario ? `${usuario.nombre}` : "Usuario desconocido";
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
        >
          {`${formatDateSpanish(params.value)} - ${formaTime(params.value)}`}
        </div>
      ),
    },
    {
      field: "referencia",
      headerName: "Referencia",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
        >
          {params.value || "Sin imagen"}
        </div>
      ),
    },
    {
      field: "objetivo",
      headerName: "Objetivo",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 0.7,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
        >
          {params.value || "Por establecer"}
        </div>
      ),
    },
    {
      field: "usuarioId",
      headerName: "Usuario",
      flex: 0.7,
      renderCell: (params) => {
        const usuarioNombre = getUsuarioNombre(params.value);
        return (
          <div
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              textAlign: "left",
            }}
          >
            {usuarioNombre}
          </div>
        );
      },
    },
    {
      field: "tiempo",
      headerName: "Tiempo",
      flex: 0.7,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
        >
          {params.value || "Por establecer"}
        </div>
      ),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }) => {
        const estadoText =
          {
            9: "Por aprobar",
            10: "Aprobada",
            11: "Aceptada",
            12: "Cancelada",
            13: "Terminada",
          }[row.estadoId] || "Desconocido";

        return <Typography>{estadoText}</Typography>;
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="left">
          <Button
            onClick={() => handleEdit(row.id)}
            sx={{ p: 0.5, minWidth: "30px", height: "36px", mr: 1, ml: 1 }}
          >
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          <Button
            onClick={() => handleDelete(row.id)}
            sx={{ p: 0.5, minWidth: "30px", height: "36px", ml: 0 }}
          >
            <TrashColor size={20} color={colors.grey[100]} />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
    <br />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ ml: 4 }} fontSize={"40px"}>
          <CalendarTodayOutlined sx={{ color: colors.purple[400], fontSize: "40px", mr: 1 }}/>
          Citas
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedCita(null);
            reset();
            setOpenModal(true);
          }}
          sx={{
            backgroundColor: colors.purple[400],
            "&:hover": {
              backgroundColor: colors.purple[300],
            },
            color: "white",
          }}
        >
          Agregar Cita
        </Button>
      </Box>
      <br />
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
            color: "${colors.purple[200]} !important",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "${colors.grey[100]} !important",
          },
        }}
      >
        {loading ? (
          <Box marginLeft={"175px"}>
            <div class="wrapper">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
            </div>
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) => row.id}
            sx={{
              height: '70vh',
            }}
          />
        )}
      </Box>

      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <form onSubmit={handleSaveCita(handleSave)}>
          <DialogTitle id="modal-title" color={colors.grey[100]}>
            {selectedCita?.id ? "Editar Cita" : "Agregar Cita"}
          </DialogTitle>
          <DialogContent>
            {selectedCita ? (
              <>
                <TextField
                  label="Tiempo"
                  fullWidth
                  variant="outlined"
                  {...registerCita("tiempo", { required: true })}
                  error={!!errorsEditCita.tiempo}
                  helperText={errorsEditCita.tiempo ? "Campo requerido" : ""}
                />
                <TextField
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="outlined"
                  {...registerCita("precio", { required: true })}
                  error={!!errorsEditCita.precio}
                  helperText={errorsEditCita.precio ? "Campo requerido" : ""}
                />
                <TextField
                  label="Estado"
                  fullWidth
                  select
                  {...registerCita("estadoId", { required: true })}
                  error={!!errorsEditCita.estadoId}
                  helperText={errorsEditCita.estadoId ? "Campo requerido" : ""}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="9">Por aprobar</option>
                  <option value="10">Aprobada</option>
                  <option value="11">Aceptada</option>
                  <option value="12">Cancelada</option>
                  <option value="13">Terminada</option>
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  label="Fecha"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  {...registerCita("fecha", { required: true })}
                  error={!!errorsEditCita.fecha}
                  helperText={errorsEditCita.fecha ? "Campo requerido" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  label="Referencia"
                  fullWidth
                  variant="outlined"
                  {...registerCita("referencia", { required: true })}
                  error={!!errorsEditCita.referencia}
                  helperText={
                    errorsEditCita.referencia ? "Campo requerido" : ""
                  }
                />
                <TextField
                  label="Objetivo"
                  fullWidth
                  variant="outlined"
                  {...registerCita("objetivo", { required: true })}
                  error={!!errorsEditCita.objetivo}
                  helperText={errorsEditCita.objetivo ? "Campo requerido" : ""}
                />
                <TextField
                  label="Usuario"
                  select
                  fullWidth
                  variant="outlined"
                  {...registerCita("usuarioId", { required: true })}
                  error={!!errorsEditCita.usuarioId}
                  helperText={errorsEditCita.usuarioId ? "Campo requerido" : ""}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Estado"
                  fullWidth
                  select
                  {...registerCita("estadoId", { required: true })}
                  error={!!errorsEditCita.estadoId}
                  helperText={errorsEditCita.estadoId ? "Campo requerido" : ""}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="9">Por aprobar</option>
                </TextField>
              </>
            )}
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta cita?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CitasDashboard;
