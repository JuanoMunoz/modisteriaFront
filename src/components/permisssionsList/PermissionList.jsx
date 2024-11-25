import { List, ListItem, ListItemText } from "@mui/material";
export default function PermissionList({ permisos }) {
  return (
    <List sx={{ marginRight: "200px" }}>
      {permisos.map((permisoActivo) => (
        <ListItem key={permisoActivo.id}>
          <ListItemText primary={permisoActivo.nombre} />
        </ListItem>
      ))}
    </List>
  );
}
