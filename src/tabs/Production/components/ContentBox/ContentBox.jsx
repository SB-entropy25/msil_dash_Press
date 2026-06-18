import { Box, Typography } from "@mui/material";
import React from "react";
import BlueCross from "../../../../assets/icons/BlueCross.svg";
import ArrowTooltip from "../../../../components/ArrowTooltip/ArrowTooltip";
import { MarutiBlack, TypeTertiary } from "../../../../utils/colors";
import { validString } from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Production.styles";

const ContentBox = ({
  type = "PRIMARY",
  placeholder = "",
  value = "",
  label = "",
  part,
  editable = true,
  onClose = () => {},
}) => {
  const classes = useStyles();
  return (
    <>
      {type === "PRIMARY" && (
        <Box className={classes["prodigi-info-primary"]}>
          <Typography
            sx={{
              color: MarutiBlack,
            }}
          >
            {label}: <strong>{value}</strong>
          </Typography>
        </Box>
      )}
      {type === "SECONDARY" && (
        <Box className={classes["prodigi-info-secondary"]}>
          {validString(value) ? (
            <Box className={classes["container-flex"]} sx={{ width: "100%" }}>
              <ArrowTooltip show={true} message={value}>
                <Typography
                  sx={{
                    color: MarutiBlack,
                  }}
                >
                  {value?.length > 13 ? value?.slice(0, 12) + "..." : value}
                </Typography>
              </ArrowTooltip>
              {editable && (
                <img
                  alt=""
                  src={BlueCross}
                  style={{ cursor: "pointer" }}
                  onClick={() => onClose(part)}
                />
              )}
            </Box>
          ) : (
            <Typography
              sx={{
                color: TypeTertiary,
              }}
            >
              {placeholder}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};
export default ContentBox;
