import { Box, Skeleton } from "@mui/material";

const TableLayout = ({
  children,
  loading = false,
  className = "",
  sx = {},
}) => {
  return (
    <Box className={className} sx={sx}>
      {loading ? (
        <Skeleton variant="rectangular" animation="wave" height={"100%"} />
      ) : (
        children
      )}
    </Box>
  );
};
export default TableLayout;
