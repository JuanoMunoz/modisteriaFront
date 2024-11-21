import Header from "../../components/Header/Header";
import { ColumnsVentas } from "../../assets/columns";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useVentasData from "../../hooks/useVentasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import Transition from "../../components/transition/Transition";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function Ventas() {
  const [data, setData] = useState([]);
  const { fetchAllVentas, updateVentas, loading } = useVentasData();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAllVentas();
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error("Error fetching ventas:", response);
      }
    };
    fetchData();
  }, []);

  const handleConfirm = async (id) => {
    try {
      const response = await updateVentas(id, { estadoId: 14 });
      if (response.status === 200) {
        const updatedData = await fetchAllVentas();
        if (updatedData.status === 200) {
          setData(updatedData.data);
        }
        toast.success("¡Venta confirmada con éxito!");
      } else {
        toast.error("Error al confirmar la venta");
      }
    } catch (error) {
      console.error("Error confirming venta:", error);
      toast.error("Error al confirmar la venta");
    }
  };

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
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>
      <ToastContainer />
    </>
  );
};
