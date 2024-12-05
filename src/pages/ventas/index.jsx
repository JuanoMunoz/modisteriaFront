import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Header from "../../components/Header/Header";
import { ColumnsVentas } from "../../assets/columns";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useVentasData from "../../hooks/useVentasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { toggleState } from "../../assets/constants.d";
import DialogActions from '@mui/material/DialogActions';
import "./ventasDash.css";
import {
  ShoppingCartOutlined,
} from "@mui/icons-material";
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
    console.log('Abriendo modal con acción:', action, 'y fila:', row);

    setDialogProps({ action, row, title });
    reset({
      // id: row?.id || "",
      fecha: row?.fecha
        ? format(new Date(row.fecha), "dd/MM/yyyy HH:mm", { locale: es })
        : "Sin fecha",
      estadoId: row?.estadoId || "Pendiente",
      nombrePersona: row?.nombrePersona || "Anónimo",
      valorDomicilio: row?.valorDomicilio || 0,
      valorPrendas: row?.valorPrendas || 0,
      valorFinal: row?.valorFinal || 0,
      metodoPago: row?.metodoPago || "Transferencia",
      citaId: row?.citaId || "Sin cita",
      imagen: row?.imagen || "No hay imagen",
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
      const response = await updateVentas(dialogProps.row.id);
      console.log(dialogProps.row);
      console.log(response);
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Error al confirmar la venta.");
        return;
      }

      setData((prevData) =>
        prevData.map((venta) =>
          venta.id === dialogProps.row.id
            ? { ...venta, estadoId: 14 } 
            : venta
        )
      );

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
  const columns = ColumnsVentas({ onConfirm: handleConfirm, onOpenDialog: handleDialog });

  return (
    <>
      <Header title="Ventas" icon={ShoppingCartOutlined} />
      <br />
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

      {/* Modal para detalles de venta */}
      <Dialog open={openAddModal} onClose={() => toggleState(setOpenAddModal)}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxWidth: "none",
          },
        }}
      >
        <DialogContent>
          <div className="venta-card">

            <div class="venta-imagen">
              {dialogProps.row?.imagen ? (
                <img
                  src={dialogProps.row?.imagen}
                  alt="Imagen"
                />
              ) : (
                <img
                  alt="Imagen no disponible"
                />
              )}
            </div>
            <div className="venta-info">
              <div class="campo">
                <label>Fecha:</label>
                <span>
                  {dialogProps.row?.fecha ? format(new Date(dialogProps.row?.fecha), "dd/MM/yyyy HH:mm", { locale: es }) : "Sin fecha"}
                </span>
              </div>
              <div class="campo">
                <label>Estado:</label>
                <span>{dialogProps.row?.estadoId === 14 ? "Pagado" : "Pendiente"}</span>
              </div>
              <div class="campo">
                <label>Valor domicilio:</label>
                <span>{dialogProps.row?.valorDomicilio ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorDomicilio) : "No aplica"}</span>
              </div>
              <div class="campo">
                <label>Valor Prendas:</label>
                <span> {dialogProps.row?.valorPrendas ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorPrendas) : "No aplica"}</span>
              </div>
              <div class="campo">
                <label>Valor Final:</label>
                <span> {dialogProps.row?.valorFinal ? new Intl.NumberFormat('es-ES').format(dialogProps.row.valorFinal) : "No aplica"}</span>
              </div>
              <div class="campo">
                <label>Metodo de Pago:</label>
                <span> {dialogProps.row?.metodoPago === "transferencia" ? "Transferencia" : dialogProps.row?.metodoPago}</span>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          {dialogProps.row?.estadoId !== 14 && !dialogProps.row?.citaId && (
            <button
              onClick={() => handleSave(dialogProps.row)}  // Confirmar la venta
              style={{
                backgroundColor: "#7C0D84",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Confirmar Venta
            </button>
          )}
          <button
            onClick={() => toggleState(setOpenAddModal)}
            style={{
              backgroundColor: "#ccc",
              color: "black",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </DialogActions>

      </Dialog>


      <ToastContainer />
    </>
  );
}