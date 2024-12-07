import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Header from "../../components/Header/Header";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { ColumnsVentas } from "../../assets/columns";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useVentasData from "../../hooks/useVentasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { estadosVenta, formToCop, toggleState } from "../../assets/constants.d";
import DialogActions from "@mui/material/DialogActions";
import "./ventasDash.css";
import { ShoppingCartOutlined } from "@mui/icons-material";
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
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    toggleState(setOpenAddModal);
  };

  const handleSave = async (formData) => {
    try {
      // Solo enviamos el id de la venta al backend
      const response = await updateVentas(dialogProps.row.id);
      console.log(dialogProps.row);
      console.log(response);
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Error al confirmar la venta.");
        return;
      }
      setData((prevData) =>
        prevData.map((venta) =>
          venta.id === dialogProps.row.id ? { ...venta, estadoId: 14 } : venta
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
  const handleConfirm = (row) => {
    handleDialog("confirm", "Confirmar venta", row);
  };
  const handleCancel = (row) => {
    handleDialog("cancel", "Cancelar venta", row);
  };
  const handleDetails = (row) => {
    handleDialog("verDetalles", "Detalles de la Venta", row);
  };
  const handleInfo = () => {
    handleDialog("info", "Estados de la venta");
  };
  const columns = ColumnsVentas({
    handleDetails,
    handleCancel,
    handleConfirm,
  });

  return (
    <>
      <Header
        title="Ventas"
        buttonText={"Ver estados"}
        handleAdd={handleInfo}
        han
        icon={ShoppingCartOutlined}
      />
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
      <Dialog
        open={openAddModal}
        onClose={() => toggleState(setOpenAddModal)}
        sx={{
          "& .MuiDialog-paper": {
            width: "65%",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
        <DialogContent>
          {dialogProps.action === "info" ? (
            <section className="info-section">
              {estadosVenta.map((estado, idx) => (
                <div key={idx}>
                  <article>
                    <span
                      style={{ background: estado.color }}
                      className="color-estado"
                    ></span>
                    <span>{estado.nombre}</span>
                  </article>
                  <p>{estado.descripcion}</p>
                </div>
              ))}
            </section>
          ) : (
            <div className="venta-card">
              <div class="venta-imagen">
                {dialogProps.row?.imagen ? (
                  <img src={dialogProps.row?.imagen} alt="Imagen" />
                ) : (
                  <div className="no-image">
                    <h3>¡Sin transferencia!</h3>
                    <span>El comprador pagó en la modisteria</span>
                  </div>
                )}
              </div>
              <div className="venta-info">
                <div class="campo">
                  <label>Nombre comprador:</label>
                  <span>
                    {dialogProps.row?.nombrePersona
                      ? dialogProps.row?.nombrePersona
                      : "Sin nombre asociado"}
                  </span>
                </div>
                {dialogProps.row?.valorDomicilio !== 0 && (
                  <div class="campo">
                    <label>Valor domicilio:</label>
                    <span>{formToCop(dialogProps.row.valorDomicilio)} COP</span>
                  </div>
                )}
                {dialogProps.row?.valorPrendas !== 0 && (
                  <div class="campo">
                    <label>Valor Prendas:</label>
                    <span>{formToCop(dialogProps.row.valorPrendas)} COP</span>
                  </div>
                )}
                <div class="campo">
                  <label>Valor Final:</label>
                  <span>
                    {dialogProps.row?.valorFinal
                      ? `${formToCop(dialogProps.row.valorFinal)} COP`
                      : "No aplica"}
                  </span>
                </div>
                <div class="campo">
                  <label>Metodo de Pago:</label>
                  <span>
                    {" "}
                    {dialogProps.row?.metodoPago === "transferencia"
                      ? "Transferencia"
                      : dialogProps.row?.metodoPago}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>

        <CustomDialogActions
          cancelButton
          handleClose={() => toggleState(setOpenAddModal)}
        />
      </Dialog>

      <ToastContainer />
    </>
  );
}
