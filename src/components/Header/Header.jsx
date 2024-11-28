import { Typography, Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
const Header = ({
  title,
  buttonText,
  handleAdd,
  secondButton,
  secondButtonText,
  handleSecondButtonFunction,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h4" sx={{ ml: 4 }} fontSize={"40px"}>
        {title}
      </Typography>
      <Box>
        {secondButton && (
          <Button
            variant="contained"
            onClick={handleSecondButtonFunction}
            sx={{
              backgroundColor: colors.purple[400],
              "&:hover": {
                backgroundColor: colors.purple[300],
              },
              color: "white",
              mr: "10px",
              textTransform: "capitalize",
            }}
          >
            {secondButtonText}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: colors.purple[400],
            "&:hover": {
              backgroundColor: colors.purple[300],
            },
            color: "white",
            mr: "10px",
            textTransform: "capitalize",
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
