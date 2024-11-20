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
