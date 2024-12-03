import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogContentText } from "@mui/material";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import useCategoriaData from "../../hooks/useCategoriaData";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsCategoriaPrendas } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import {
  StyleOutlined
} from "@mui/icons-material";

const CategoriaPrenda = () => {
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [data, setData] = useState([]);

  const {
    fetchAllCategorias,
    loading,
    updateCategoria,
    createCategoria,
    deleteCategoria,
    initialFetchAllCategorias
  } = useCategoriaData();

  const {
    handleSubmit: handleSaveCategoria,
    formState: { errors: errorsAddCategoria },
    register: registerCategoria,
    reset,
  } = useForm();

  

  useEffect(() => {
    const initialFetchCategorias = async () => {
      const respuesta = await initialFetchAllCategorias();
      if (respuesta.status === 200) {
        console.log(respuesta.data); // Verifica si el campo 'molde' está presente y tiene valores
        setData(respuesta.data);
      }
    };
    initialFetchCategorias();
  }, []);
  
  // Funciones para las modales
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({ nombre: row?.nombre || "", descripcion: row?.descripcion || "", molde: row?.molde || "" });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir categoría");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar categoría", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar categoría", row);
  };
  const handleDownload = (row) => {
    if (!row.molde) {
      toast.error("Molde no disponible");
      return;
    }
    window.open(row.molde, "_blank");
  };  
  
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateCategoria(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllCategorias();
    setData(updatedData.data);
  };

  const handleSave = async (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("descripcion", formData.descripcion);
    if (formData.molde && formData.molde[0]) {
      dataToSend.append("molde", formData.molde[0]);
    }

    console.log([...dataToSend.entries()]); // Imprime los campos que estás enviando
    let response;
    if (dialogProps.action === "add")
      response = await createCategoria(dataToSend);
    if (dialogProps.action === "edit")
      response = await updateCategoria(dialogProps.row.id, dataToSend);
    if (dialogProps.action === "delete")
      response = await deleteCategoria(dialogProps.row.id);

    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });

    const updatedData = await fetchAllCategorias();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Categoría ${dialogProps.action === "add"
        ? "agregada"
        : dialogProps.action === "edit"
          ? "editada"
          : "eliminada"
      } con éxito!`,
      {
        autoClose: 1800,
        toastId: "crudAction",
      }
    );
  };

  const columns = ColumnsCategoriaPrendas({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDownload: handleDownload,
    changeState: handleChangeState,
  });
  return (
    <>
      <Header
        title={"Categorías prenda"}
        handleAdd={handleAdd}
        buttonText={"Agregar categoría"}
        icon={StyleOutlined}
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
                sortModel: [{ field: "nombre", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              height: '70vh',
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
        <form onSubmit={handleSaveCategoria(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Estás seguro de que deseas eliminar la categoría "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : (
              <div>
                <InputDash
                  {...registerCategoria("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                    maxLength: { value: 69, message: "¡Máximo 70 caracteres!" },
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddCategoria.nombre && errorsAddCategoria.nombre.message
                  }
                />
                <InputDash
                  {...registerCategoria("descripcion", {
                    minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                    maxLength: {
                      value: 255,
                      message: "¡Máximo 255 caracteres!",
                    },
                  })}
                  label={"Descripción"}
                  type={"text"}
                  description={
                    errorsAddCategoria.descripcion &&
                    errorsAddCategoria.descripcion.message
                  }
                />
                {/* Nuevo campo para el archivo PDF */}
                <input
                  type="file"
                  accept="application/pdf"
                  {...registerCategoria("molde", {
                    required: dialogProps.action === "add" && "El archivo es requerido",
                  })}
                />
                {errorsAddCategoria.molde && (
                  <span>{errorsAddCategoria.molde.message}</span>
                )}
              </div>

            )
            }
          </DialogContent>
          <CustomDialogActions
            cancelButton
            customCancelColor={dialogProps.action === "delete" && "inherit"}
            saveButton={dialogProps.action !== "delete"}
            deleteButton={dialogProps.action === "delete"}
            handleClose={() => toggleState(setOpenModal)}
          />          
        </form>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default CategoriaPrenda;