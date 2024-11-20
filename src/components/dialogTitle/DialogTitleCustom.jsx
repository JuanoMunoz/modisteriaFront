import { DialogTitle } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
export default function DialogTitleCustom({ children }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <DialogTitle
      color={colors.grey[100]}
      fontSize={"25px"}
      textAlign={"center"}
    >
      {children}
    </DialogTitle>
  );
}
