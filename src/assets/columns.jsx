import { Button, Switch, alpha, Box } from "@mui/material";
import { Edit, TrashColor, Eye } from "../components/svg/Svg";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
function SwitchCustom({ row, changeState }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Switch
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: colors.purple[200],
          "&:hover": {
            backgroundColor: alpha(
              colors.purple[200],
              theme.palette.action.hoverOpacity
            ),
          },
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: colors.purple[200],
        },
      }}
      color="warning"
      checked={row.estadoId === 1}
      onChange={(e) => changeState(e, row)}
    />
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

export const ColumnsCategoriaPrendas = ({ onEdit, onDelete, changeState }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 2,
    valueGetter: (params) =>
      params.row.descripcion ? params.row.descripcion : "Sin descripción",
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
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

export const ColumnsInsumos = ({
  onEdit,
  onDelete,
  changeState,
  getCategoriaNombre,
  getUnidadMedida,
}) => [
  {
    field: "nombre",
    headerName: "Nombre",
    flex: 1,
  },
  {
    field: "cantidad",
    headerName: "Cantidad",
    flex: 1,
    valueGetter: (params) =>
      `${params.row.cantidad}  ${getUnidadMedida(params.row.unidadMedidaId)}`,
  },
  {
    field: "categoriaInsumoId",
    headerName: "Categoría",
    flex: 1,
    valueGetter: (params) => getCategoriaNombre(params.row.categoriaInsumoId),
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
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
export const ColumnsUsuarios = ({
  onEdit,
  onDelete,
  changeState,
  getRoleId,
  payload,
}) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "email", headerName: "Correo", flex: 1 },
  { field: "telefono", headerName: "Teléfono", flex: 1 },
  {
    field: "direccion",
    headerName: "Dirección",
    flex: 1,
    valueGetter: (params) =>
      params.row.direccion ? params.row.direccion : "Sin dirección agregada",
  },
  {
    field: "roleId",
    headerName: "Rol",
    flex: 1,
    valueGetter: (params) => getRoleId(params.row.roleId),
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) =>
      payload?.email !== row.email ? (
        <SwitchCustom row={row} changeState={changeState} />
      ) : (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <h4>Usuario activo</h4>
        </Box>
      ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return row.email === payload?.email ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <h4>Sin acciones</h4>
        </Box>
      ) : (
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

export const ColumnsCategoriaInsumos = ({ onEdit, onDelete, changeState }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "tipo",
    headerName: "Tipo insumo",
    flex: 1,
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 2,
    valueGetter: (params) =>
      params.row.descripcion ? params.row.descripcion : "Sin descripción",
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
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
  { field: "id", headerName: "ID", flex: 0.1 },
  {
    field: "imagen",
    headerName: "Imagen",
    flex: 1,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {params.value ? (
          <img
            src={params.value}
            alt="Imagen de venta"
            style={{ width: "100px", height: "auto", borderRadius: "8px" }} // Ajusta el tamaño de la imagen
          />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>
    ),
  },
  {
    field: "fecha",
    headerName: "Fecha",
    flex: 1,
    renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy HH:mm", { locale: es }),
  },
  { field: "nombrePersona", headerName: "Nombre Persona", flex: 1 },
  { field: "valorDomicilio", headerName: "Valor Domicilio", flex: 1 },
  { field: "valorPrendas", headerName: "Valor Prendas", flex: 1 },
  { field: "valorFinal", headerName: "Valor Final", flex: 1 },
  {
    field: "metodoPago",
    headerName: "Método de Pago",
    flex: 1,
    renderCell: (params) => {
      const metodoPago = params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "Sin método de pago";
      return metodoPago;
    },
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: (params) => {
      const estados = {
        14: "Pagado",
        9: "Pendiente",
      };
      return estados[params.value] || "Desconocido";
    },
  },
  {
    field: "citaId",
    headerName: "Cita ID",
    flex: 1,
    renderCell: (params) => (params.value ? params.value : "Sin cita"),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      // Verificamos el estado para decidir qué mostrar
      if (row.estadoId === 14) {
        // Si el estado es '14', mostrar el texto "Venta Confirmada"
        return <span>Venta Confirmada</span>;
      }
      // Si el estado es '9' (Pendiente), mostrar el botón de Confirmar Venta
      return (
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
      );
    },
  },
];

export const ColumnsRoles = ({
  onEdit,
  onDelete,
  changeState,
  handlePermission,
}) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "permisosId",
    headerName: "Permisos",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      row.permisos = row.Permisos.map((permiso) => permiso.id);
      return (
        <Button
          onClick={() => {
            handlePermission(row);
          }}
        >
          <Eye size={20} color={colors.grey[100]}></Eye>
        </Button>
      );
    },
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) =>
      row.id >= 5 ? (
        <SwitchCustom row={row} changeState={changeState} />
      ) : (
        "Activo"
      ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return row.id >= 5 ? (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <span style={{ paddingLeft: "25px" }}>Sin acciones</span>
      );
    },
  },
];
