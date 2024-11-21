import { Button } from "@mui/material";
import { Edit, TrashColor } from "../components/svg/Svg";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

function Actions({ colors, row, onEdit, onDelete }) {
  return (
    <div>
      <Button onClick={() => onEdit(row)}>
        <Edit size={20} color={colors.grey[100]} />
      </Button>
      <Button onClick={() => onDelete(row)}>
        <TrashColor size={20} color={colors.grey[100]} />
      </Button>
    </div>
  );
}

export const ColumnsTallas = ({ onEdit, onDelete }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "tipo", headerName: "Tipo", flex: 1 },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsUnidadesDeMedida = ({ onEdit, onDelete }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsVentas = ({ onConfirm }) => [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "imagen", headerName: "Imagen", flex: 1 },
  { field: "fecha", headerName: "Fecha", flex: 1 },
  { field: "nombrePersona", headerName: "Nombre Persona", flex: 1 },
  { field: "valorDomicilio", headerName: "Valor Domicilio", flex: 1 },
  { field: "valorPrendas", headerName: "Valor Prendas", flex: 1 },
  { field: "valorFinal", headerName: "Valor Final", flex: 1 },
  { field: "metodoPago", headerName: "Método de Pago", flex: 1 },
  { field: "estadoId", headerName: "Estado", flex: 1 },
  { field: "citaId", headerName: "Cita ID", flex: 1, renderCell: (params) => (params.value ? params.value : "Sin cita") },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => (
      <button
        onClick={() => onConfirm(row.id)}
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
    ),
  },
];
