import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Dialog, DialogContent, Button, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

// Componentes personalizados
import Header from "../../components/Header/Header";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";

// Hooks y constantes
import useVentasData from "../../hooks/useVentasData";
import { ColumnsVentas } from "../../assets/columns";
import { estadosVenta, formToCop, toggleState } from "../../assets/constants.d";

// Estilos
import "./ventasDash.css";
import { ShoppingCartOutlined } from "@mui/icons-material";

export default function Ventas() {
  // Estados
  const [data, setData] = useState([]);
  const [dialogProps, setDialogProps] = useState({ action: "", title: "", row: null });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Hooks personalizados
  const { fetchAllVentas, updateVentas, cancelarVenta, initialFetchAllVentas, loading } = useVentasData();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Efecto inicial
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);

  // Funciones auxiliares
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, title, row });
    reset({ motivo: "" }); // Reinicia el motivo en el formulario
    toggleState(setOpenAddModal);
  };

  const handleConfirmVenta = async () => {
    try {
      const response = await updateVentas(dialogProps.row.id);
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Error al confirmar la venta.");
        return;
      }
      setData((prevData) =>
        prevData.map((venta) =>
          venta.id === dialogProps.row.id ? { ...venta, estadoId: 14 } : venta
        )
      );
      toast.success("¡Venta confirmada con éxito!");
      toggleState(setOpenAddModal);
    } catch (error) {
      toast.error(`Error en la operación: ${error.message}`);
    }
  };

  const handleCancelVenta = async (formData) => {
    try {
      const response = await cancelarVenta(dialogProps.row.id, { motivo: formData.motivo });
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Error al cancelar la venta.");
        return;
      }
      setData((prevData) =>
        prevData.map((venta) =>
          venta.id === dialogProps.row.id ? { ...venta, estadoId: 12 } : venta
        )
      );
      toast.success("¡Venta cancelada con éxito!");
      toggleState(setOpenAddModal);
    } catch (error) {
      toast.error(`Error en la operación: ${error.message}`);
    }
  };

  const columns = ColumnsVentas({
    handleDetails: (row) => handleDialog("verDetalles", "Detalles de la Venta", row),
    handleConfirm: (row) => handleDialog("confirm", "Confirmar Venta", row),
    handleCancel: (row) => handleDialog("cancel", "Cancelar Venta", row),
  });

  // Renderizado
  return (
    <>
      <Header
        title="Ventas"
        buttonText="Ver estados"
        handleAdd={() => handleDialog("info", "Estados de la venta")}
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
              sorting: { sortModel: [{ field: "fecha", sort: "asc" }] },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>
      <Dialog
        open={openAddModal}
        onClose={() => toggleState(setOpenAddModal)}
        sx={{
          "& .MuiDialog-paper": { width: "65%", maxWidth: "none" },
        }}
      >
        <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
        <DialogContent>
          {dialogProps.action === "info" && (
            <section className="info-section">
              {estadosVenta.map((estado, idx) => (
                <div key={idx}>
                  <article>
                    <span style={{ background: estado.color }} className="color-estado"></span>
                    <span>{estado.nombre}</span>
                  </article>
                  <p>{estado.descripcion}</p>
                </div>
              ))}
            </section>
          )}
          {dialogProps.action === "verDetalles" && (
            <div className="venta-card">
              <div className="venta-imagen">
                {dialogProps.row?.imagen ? (
                  <img src={dialogProps.row.imagen} alt="Imagen" />
                ) : (
                  <div className="no-image">
                    <h3>¡Sin transferencia!</h3>
                    <span>El comprador pagó en la modistería</span>
                  </div>
                )}
              </div>
              <div className="venta-info">
                <div className="campo">
                  <label>Nombre comprador:</label>
                  <span>{dialogProps.row?.nombrePersona || "Sin nombre asociado"}</span>
                </div>
                <div className="campo">
                  <label>Valor Final:</label>
                  <span>
                    {dialogProps.row?.valorFinal
                      ? `${formToCop(dialogProps.row.valorFinal)} COP`
                      : "No aplica"}
                  </span>
                </div>
                <div className="campo">
                  <label>Método de Pago:</label>
                  <span>{dialogProps.row?.metodoPago || "No especificado"}</span>
                </div>
              </div>
            </div>
          )}
          {dialogProps.action === "confirm" && (
            <form onSubmit={handleSubmit(handleConfirmVenta)}>
              <p>¿Está seguro de confirmar la venta?</p>
              <Button type="submit">Confirmar Venta</Button>
            </form>
          )}
          {dialogProps.action === "cancel" && (
            <form onSubmit={handleSubmit(handleCancelVenta)}>
              <p>¿Está seguro de cancelar la venta? Escriba el motivo:</p>
              <TextField
                label="Motivo de Cancelación"
                {...register("motivo", { required: "Este campo es obligatorio" })}
                fullWidth
                margin="normal"
                error={!!errors.motivo}
                helperText={errors.motivo ? errors.motivo.message : ""}
              />
              <Button type="submit">Cancelar Venta</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
}
