import { Circle } from "@mui/icons-material";
import { Box, Checkbox, TableCell, TableRow } from "@mui/material";
import useStyles from "../../Production.styles";

const TableData = ({
  row = {},
  columnWidth,
  onChange = () => {},
  selected,
}) => {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell align="center" sx={{ width: columnWidth.model }}>
        {row?.model}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.part_name }}>
        {row?.part_name}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.part_no }}>
        {row?.material_code}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.planned_qty }}>
        {row?.planned_qty}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.actual_qty }}>
        <Box
          className={classes["container-flex-start"]}
          sx={{
            gap: 1,
            width: "6rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Circle
            color={row?.actual_qty > row?.planned_qty ? "Green" : "Yellow"}
            fontSize="small"
          />
          {row?.actual_qty}
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.priority }}>
        {row?.priority}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.check }}>
        <Checkbox
          size="large"
          color="Blue"
          disableRipple
          checked={selected}
          onChange={(e) => onChange(e.target.checked, row)}
          // checked={areAllGroupOptionsSelected(item.options)}
          // onChange={handleGroupToggle(item.options)}
        />
      </TableCell>
    </TableRow>
  );
};
export default TableData;
