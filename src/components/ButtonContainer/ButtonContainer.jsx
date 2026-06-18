import { Box } from "@mui/material";

const ButtonContainer = ({ children, type = "RIGHT", sx = {} }) => {
  const containerType = {
    LEFT: "flex-start",
    RIGHT: "flex-end",
    CENTER: "center",
    BETWEEN: "space-between",
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: containerType[type],
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
export default ButtonContainer;
