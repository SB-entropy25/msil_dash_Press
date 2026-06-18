import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { TypeSecondary } from "../../../../utils/colors";
import useStyles from "./Table.styles";
import TableData from "./TableData";

const columnWidth = {
  machine: "15%",
  target: "40%",
  prodQty: "10%",
  targetValue: "10%",
  targetAchid: "15%",
};

const Table = ({ data, loader, endMessage }) => {
  const classes = useStyles();

  return (
    <TableLayout
      loading={loader}
      className={classes["prodigi-table-dimensions"]}
    >
      <TableContainer className={classes["prodigi-table"]}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  width: columnWidth.machine,
                  color: `${TypeSecondary}!important`,
                }}
              >
                Machine List
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  width: columnWidth.target,
                  color: `${TypeSecondary}!important`,
                }}
              >
                Target
              </TableCell>

              <TableCell
                align="left"
                sx={{
                  width: columnWidth.prodQty,
                  color: `${TypeSecondary}!important`,
                }}
              >
                Actual Production Qty
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  width: columnWidth.targetValue,
                  color: `${TypeSecondary}!important`,
                }}
              >
                Target
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  width: columnWidth.targetAchid,
                  color: `${TypeSecondary}!important`,
                }}
              >
                Target Achieved %
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => {
              return (
                <TableData
                  key={index}
                  index={index}
                  row={item}
                  columnWidth={columnWidth}
                />
              );
            })}
          </TableBody>
        </MuiTable>
        {/* {loader && (
          <Box sx={{ mt: 1 }}>
            <Loader size="SMALL" />
          </Box>
        )}
        {!loader && (
          <Box sx={{ mt: 1 }}>
            <Typography style={{ color: MarutiBlue500 }}>
              {endMessage}
            </Typography>
          </Box>
        )} */}
      </TableContainer>
    </TableLayout>
  );
};

export default Table;
