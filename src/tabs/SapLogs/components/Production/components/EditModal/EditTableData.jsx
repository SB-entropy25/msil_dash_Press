import { Box, Checkbox, TableCell, TableRow } from "@mui/material";
import React, { Fragment } from "react";
import TextInput from "../../../../../../components/TextField/TextField";
import { MarutiWhite } from "../../../../../../utils/colors";
import { editModalColumn } from "./EditModalColumn";

const EditTableData = React.memo(
  ({ tableData, handleInputChange, isEditData, handleCheckboxChange }) => {
    const TableCellData = ({ column = {}, item = "" }) => {
      switch (column?.value) {
        case "checkbox":
          return (
            <Box sx={{ alignItems: "center" }}>
              <Checkbox
                size={"large"}
                sx={{ m: 0, p: 0 }}
                checked={tableData?.isChecked}
                onChange={() => handleCheckboxChange(tableData?.id)}
              />
            </Box>
          );
        case "header_material":
          return tableData?.output_part_number1;
        default:
          return item;
      }
    };

    const arrOutput = [
      "input_part_number1",
      "input_part_number2",
      "input1_material_batch_details",
      "input2_material_batch_details",
    ];

    let left = 0;
    let fixedCount = 0;
    const commonStyle = {
      backgroundColor: MarutiWhite,
      wordWrap: "break-word",
      overflowWrap: "anywhere",
      borderRight: "1px solid #E6E9F0",
    };
    return (
      <Fragment>
        <TableRow>
          {Object.values(editModalColumn).map((column, index) => {
            const isFixed = column.fixed;
            const cellStyle = isFixed
              ? {
                  position: "sticky",
                  left: `${left}vw`,
                  zIndex: 2,
                  width: `${column?.width}vw`,
                  minWidth: `${column?.width}vw`,
                  maxWidth: `${column?.width}vw`,
                  ...commonStyle,
                }
              : {
                  width: `${column?.width}vw`,
                  minWidth: `${column?.width}vw`,
                  maxWidth: `${column?.width}vw`,
                  ...commonStyle,
                };

            if (isFixed) {
              left += column.width;
              fixedCount += 1;
              if (fixedCount === 5) {
                cellStyle.borderRight = "4px solid #E6E9F0";
                cellStyle.boxShadow = "2px 0px 2px -2px rgba(0, 0, 0, 0.2)";
              }
            }

            if (arrOutput.includes(column.value) && isEditData) {
              return (
                <TableCell key={column.value} sx={cellStyle}>
                  <Box sx={{ width: "100%", position: "relative" }}>
                    <TextInput
                      fontSize="1.4rem"
                      textFieldStyle={{
                        "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                          { WebkitAppearance: "none", margin: 0 },
                      }}
                      height="4.571rem"
                      disabled={false}
                      name="value"
                      value={tableData[column.value] || ""}
                      onChange={(evt) =>
                        handleInputChange(
                          evt.target.value,
                          column?.value,
                          tableData
                        )
                      }
                      placeholder={""}
                    />
                  </Box>
                </TableCell>
              );
            }

            return (
              <TableCell key={index.toString()} sx={cellStyle}>
                <TableCellData item={tableData[column.value]} column={column} />
              </TableCell>
            );
          })}
        </TableRow>
      </Fragment>
    );
  }
);

export default EditTableData;
