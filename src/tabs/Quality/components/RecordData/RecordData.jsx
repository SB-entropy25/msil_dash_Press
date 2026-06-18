import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import _ from "lodash";
import * as React from "react";
import Select from "../../../../components/Select/Select";
import TextField from "../../../../components/TextField/TextField";
import useStyles from "../../Quality.styles";

const RecordData = ({
  item = {},
  index = 0,
  handleChange = () => {},
  handleRemove = () => {},
  length = 0,
  reasons = {},
}) => {
  const classes = useStyles();
  return (
    <>
      {!item?.is_deleted && (
        <Box
          sx={{
            gap: 2,
            mb: 1.2,
          }}
        >
          <Divider sx={{ mb: 1.6 }} />
          <Box
            component="span"
            className={classes["card-container-flex"]}
            sx={{ gap: "2rem" }}
            key={item.index}
          >
            <Box sx={{ width: "16rem" }}>
              <Typography
                className={classes["quantity-header"]}
                sx={{ marginBottom: "1.2rem" }}
              >
                Evaluation
              </Typography>
              <Select
                type="INVERTED"
                label="Select"
                value={item.evaluation}
                sx={{ width: "16rem" }}
                clearIcon={false}
                isAll={false}
                name="evaluation"
                disabled={item.disabled}
                error={item?.isElvErr}
                onChange={(e) => handleChange(e, index)}
              >
                {Object.keys(reasons)?.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {_.capitalize(option)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ width: "7rem" }}>
              <Typography
                className={classes["quantity-header"]}
                sx={{ marginBottom: "1.2rem" }}
              >
                Quantity
              </Typography>
              <TextField
                sx={{ width: "7rem" }}
                type="number"
                // min={1}
                value={item.quantity}
                id={item.index}
                name="quantity"
                disabled={item.disabled}
                error={item?.isQntErr}
                onChange={(e) => handleChange(e, index)}
              />
            </Box>
            <Box sx={{ width: "25rem" }}>
              <Typography
                className={classes["quantity-header"]}
                sx={{ marginBottom: "1.2rem" }}
              >
                Reason
              </Typography>
              <Select
                type="INVERTED"
                label="Select"
                value={item.reasonLabel}
                sx={{ width: "25rem" }}
                clearIcon={false}
                disabled={item.disabled}
                name="reason"
                isAll={false}
                error={item?.rsnErr}
                onChange={(e) => handleChange(e, index)}
              >
                {item?.reasonList?.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option?.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography
                className={classes["quantity-header"]}
                sx={{ marginBottom: "1.2rem" }}
              >
                Remarks
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                name="remark"
                placeholder="Please provide remarks here"
                value={item.remark}
                disabled={item.disabled}
                error={item?.rmkErr}
                onChange={(e) => handleChange(e, index)}
              />
            </Box>
            {length > 0 && (
              <Box
                sx={{
                  width: "5rem",
                  marginTop: "2.5rem",
                  display: item?.disabled ? "none" : "flex",
                  alignItems: "anchor-center",
                }}
              >
                <DeleteIcon
                  fontSize="large"
                  color="Red"
                  sx={{
                    cursor: "pointer",
                  }}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && handleRemove(item, index)}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
export default RecordData;
