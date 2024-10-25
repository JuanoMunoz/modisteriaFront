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

const CitasDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCita,
    formState: { errors: errorsAddCita },
    register: registerCita,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const {
    fetchAllCitas,
    loading,
    updateCita,
    createCita,
    deleteCita,
    initialFetchAllCitas,
  } = useCitasData();

  useEffect(() => {
    const initialFetchCitas = async () => {
      const respuesta = await initialFetchAllCitas();
      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      } else {
        setErrorMessage("Error al cargar las citas.");
        setOpenErrorModal(true);
      }
    };
    initialFetchCitas();
  }, []);

  const handleEdit = (id) => {
    const citaToEdit = data.find((cita) => cita.id === id);
    setSelectedCita(citaToEdit);
    reset(citaToEdit);
    setOpenModal(true);
  };

  const handleAdd = () => {
    const initialCitaBody = {
      fecha: "",
      referencia: "",
      objetivo: "",
      precio: "",
      usuarioId: "",
      tiempo: "",
      estadoId: 1,
    };
    setSelectedCita(initialCitaBody);
    reset(initialCitaBody);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedCita(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCita?.id) {
        const respuesta = await updateCita(selectedCita.id, {
          ...formData,
        });

        if (respuesta.status === 200 || respuesta.status === 201) {
          const updatedData = data.map((cita) =>
            cita.id === selectedCita.id ? { ...cita, ...formData } : cita
          );
          setData(updatedData);
        } else {
          throw new Error("Error al editar la cita.");
        }
      } else {
        const respuesta = await createCita({
          ...formData,
          estadoId: 1,
        });

        if (respuesta.status === 201) {
          const updatedData = await fetchAllCitas();

          if (updatedData.status === 200 && updatedData.data) {
            setData(updatedData.data);
          }
        } else {
          throw new Error("Error al crear la cita.");
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      setErrorMessage(error.message || "Error al editar la cita.");
      setOpenErrorModal(true);
    } finally {
      handleClose();
    }
  };

  const handleDelete = (id) => {
    const cita = data.find((cita) => cita.id === id);
    setCitaToDelete(cita);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (citaToDelete.estadoId !== 2) {
      setErrorMessage("No se puede eliminar la cita si está activa.");
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
      return;
    }
    const respuesta = await deleteCita(citaToDelete.id);
    if (respuesta.status === 201) {
      setData(data.filter((cita) => cita.id !== citaToDelete.id));
      setOpenDeleteDialog(false);
      setCitaToDelete(null);
    } else {
      setErrorMessage(respuesta.data.message);
      setOpenErrorModal(true);
      setOpenDeleteDialog(false);
    }
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
    { field: "precio", headerName: "Precio", flex: 0.7 },
    { field: "usuarioId", headerName: "Usuario", flex: 0.7 },
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
            sx={{ p: 0, mr: 1, ml: -3 }}
          >
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          <Button onClick={() => handleDelete(row.id)} sx={{ p: 0, ml: -5 }}>
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
          Citas
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
          }}
        >
          Agregar Cita
        </Button>
      </Box>
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
          <Typography>Cargando citas...</Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </Box>

      {/* Modal para agregar/editar cita */}
      <Dialog open={openModal} onClose={handleClose}>
        <form onSubmit={handleSaveCita(handleSave)}>
          <DialogTitle color={colors.grey[100]}>
            {selectedCita?.id ? "Editar Cita" : "Agregar Cita"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="fecha"
              label="Fecha"
              type="date"
              fullWidth
              variant="outlined"
              {...registerCita("fecha", {
                required: "La fecha es requerida.",
              })}
              value={selectedCita?.fecha || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  fecha: e.target.value,
                })
              }
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCita?.fecha?.message}
            />
            <TextField
              margin="dense"
              name="referencia"
              label="Referencia"
              type="text"
              fullWidth
              variant="outlined"
              {...registerCita("referencia", {
                required: "La referencia es requerida.",
              })}
              value={selectedCita?.referencia || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  referencia: e.target.value,
                })
              }
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddCita?.referencia?.message}
            />
            <TextField
              margin="dense"
              name="objetivo"
              label="Objetivo"
              type="text"
              fullWidth
              variant="outlined"
              {...registerCita("objetivo")}
              value={selectedCita?.objetivo || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  objetivo: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              variant="outlined"
              {...registerCita("precio")}
              value={selectedCita?.precio || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  precio: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              name="usuarioId"
              label="Usuario ID"
              type="text"
              fullWidth
              variant="outlined"
              {...registerCita("usuarioId")}
              value={selectedCita?.usuarioId || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  usuarioId: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              name="tiempo"
              label="Tiempo"
              type="text"
              fullWidth
              variant="outlined"
              {...registerCita("tiempo")}
              value={selectedCita?.tiempo || ""}
              onChange={(e) =>
                setSelectedCita({
                  ...selectedCita,
                  tiempo: e.target.value,
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

      {/* Modal para confirmar eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle color={colors.grey[100]}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la cita "
            {citaToDelete?.referencia}"?
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

      {/* Modal para errores */}
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

export default CitasDashboard;
