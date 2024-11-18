import Header from "../../components/Header/Header"
import { Edit,TrashColor } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import useUnidadesMedida from "../../hooks/useUnidadesMedida"
import "./unidadesMedida.css"
import { Button } from "@mui/material";
import { colors } from "@mui/material";
import { useEffect, useState } from "react";
export default function UnidadesMedida() {
    const [data,setData] = useState([])
    const {initialFetchAllUnidades,fetchAllUnidades,updateUnidades,createUnidades,deleteUnidades} = useUnidadesMedida()
    useEffect(()=>{
        const initialFetch = async()=>{
            const response = await initialFetchAllUnidades()
            if(response.status === 200)setData(response.data);       
        }
        initialFetch()
    },[])
    const columns = [
        { field: "nombre", headerName: "Nombre", flex: 1 },
        {
          field: "acciones",
          headerName: "Acciones",
          flex: 1,
          renderCell: ({ row }) => (
            <div>
              <Button onClick={() => {}}>
                <Edit size={20} color={colors.grey[100]} />
              </Button>
              <Button onClick={() =>{}}>
                <TrashColor size={20} color={colors.grey[100]} />
              </Button>
            </div>
          ),
        },
      ];

    return (
        <>
        <Header title="Unidades de medida" buttonText="Agregar unidad"></Header>
        <main className="customDataGrid">
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
          />
        </main>
        </>
    )
}