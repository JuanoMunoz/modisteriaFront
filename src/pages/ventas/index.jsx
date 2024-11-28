import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

import Header from "../../components/Header/Header";
import { ColumnsVentas } from "../../assets/columns";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useVentasData from "../../hooks/useVentasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import Transition from "../../components/transition/Transition";
import InputDash from "../../components/inputDashboard/InputDash";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { toggleState } from "../../assets/constants.d";

export default function Ventas() {
  // Estado para los datos, modal y control de apertura
  const [data, setData] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Custom hook para manejar datos de ventas
  const { fetchAllVentas, updateVentas, initialFetchAllVentas, loading } =
    useVentasData();

  // Validación de formularios
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  // Carga inicial de datos
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);

  // Función para abrir la modal
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      id: row?.id || "",
      imagen: row?.imagen || "Sin imagen",
      fecha: row?.fecha
        ? format(new Date(row.fecha), "dd/MM/yyyy HH:mm", { locale: es })
        : "Sin fecha",
      nombrePersona: row?.nombrePersona || "Anónimo",
      valorDomicilio: row?.valorDomicilio || 0,
      valorPrendas: row?.valorPrendas || 0,
      valorFinal: row?.valorFinal || 0,
      metodoPago: row?.metodoPago || "Transferencia",
      estadoId: row?.estadoId || "Pendiente",
      citaId: row?.citaId || "Sin cita",
    });
    toggleState(setOpenAddModal);
  };

  // Confirmar edición de una venta
  const handleConfirm = (row) => {
    handleDialog("edit", "Confirmar venta", row);
  };

  // Guardar cambios
  const handleSave = async (formData) => {
    try {  
      const parsedData = {
        id: formData.id,
        ...formData,
      };
  
      if (dialogProps.action === "edit") {
        const response = await updateVentas(dialogProps.row.id, {
          estadoId: 14,
        });
  
        if (response.status !== 200 && response.status !== 201) {
          toast.error("Error al guardar la venta.");
          return;
        }
  
        setData((prevData) =>
          prevData.map((venta) =>
            venta.id === dialogProps.row.id
              ? { ...venta, estadoId: 14 }
              : venta
          )
        );
      }
      toggleState(setOpenAddModal);
      toast.success(`¡Venta confirmada con éxito!`, {
        autoClose: 1800,
        toastId: "crudAction",
      });
    } catch (error) {
      toast.error(`Error en la operación: ${error.message}`);
    }
  };
  

  // Columnas de la tabla
  const columns = ColumnsVentas({ onConfirm: handleConfirm });

  return (
    <>
      <Header title="Ventas" />
      <ContainerDataGrid>
        {loading ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "fecha", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>
  
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openAddModal}
        onClose={() => toggleState(setOpenAddModal)}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            <InputDash
              {...register("metodoPago", { required: "El método de pago es requerido" })}
              label={"Método de Pago"}
              type={"text"}
              description={errors.metodoPago && errors.metodoPago.message}
            />
          </DialogContent>
          <CustomDialogActions
            cancelButton
            saveButton
            handleClose={() => toggleState(setOpenAddModal)}
          />
        </form>
      </Dialog>
      <ToastContainer />
    </>
  );
  
}
