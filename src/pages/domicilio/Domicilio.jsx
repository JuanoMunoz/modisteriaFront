import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import useDomicilioData from "../../hooks/useDomicilioInfo";
import { toggleState } from "../../assets/constants.d";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { ColumnsDomicilios } from "../../assets/columns";
import { ToastContainer } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import Transition from "../../components/transition/Transition";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";

export default function Domicilio() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const { initialFetchAllDomicilios, fetchAllDomicilios, loading } =
    useDomicilioData();
  useEffect(() => {
    const initialFetchDomicilios = async () => {
      const respuesta = await initialFetchAllDomicilios();
      if (respuesta.status === 200 && respuesta.data) {
        console.log(respuesta.data);
        setData(respuesta.data);
      }
    };
    initialFetchDomicilios();
  }, []);
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir talla");
  };
  const handleDetails = (row) => {
    handleDialog("details", "Detalle Domicilio", row);
  };

  const columns = ColumnsDomicilios({ handleDetails });
  return (
    <>
      <Header title={"Domicilios"} buttonText={"Información"} />
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
                sortModel: [{ field: "tipo", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              height: "70vh",
            }}
          />
        )}
      </ContainerDataGrid>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(setOpenModal)}
      >
        <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
        <DialogContent>
          {dialogProps.action === "delete" ? (
            <DialogContentText>{`¿Estás seguro de que deseas eliminar la unidad de medida "${dialogProps.row.nombre}" ?`}</DialogContentText>
          ) : (
            <div>hola desde detllae</div>
          )}
        </DialogContent>
        <CustomDialogActions
          cancelButton
          customCancelColor={dialogProps.action == "delete" && "inherit"}
          saveButton={dialogProps.action !== "delete"}
          deleteButton={dialogProps.action === "delete"}
          handleClose={() => toggleState(setOpenModal)}
        />
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
}
