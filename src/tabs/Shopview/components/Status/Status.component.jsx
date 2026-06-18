import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import Critical from "../../../../assets/icons/Critical.svg";
import { selectshopVewStatus } from "../../../../redux/Selectors/ShopviewSelector";
import {
  MarutiBlack,
  MarutiSilverDark,
  TypePrimary,
} from "../../../../utils/colors";
import Filters from "../Filters/Filters.component";
import useStyles from "./Status.styles";

const Status = ({
  filters = {},
  onChange = () => {},
  domain = {},
  onRefresh = () => {},
}) => {
  const classes = useStyles();
  const { status = {}, achieved = {} } = useSelector(selectshopVewStatus);
  return (
    <Box
      className={classes["container-flex"]}
      // sx={{ border: "1px solid green" }}
    >
      <Box className={classes["status-container-flex"]}>
        <Box>
          <Box
            className={classes["machine"]}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box>MACHINE STATUS</Box>
            <Typography
              variant="body6"
              sx={{ fontWeight: "700", color: MarutiBlack }}
            >
              TOTAL{" "}
              {Number(status?.RUNNING || 0) +
                Number(status?.SCHEDULED || 0) +
                Number(status?.IDLE || 0) +
                Number(status?.BREAKDOWN || 0)}
            </Typography>
          </Box>
          <Box className={classes["container-flex"]}>
            <Box className={classes["status"]} sx={{ width: "10rem" }}>
              <Typography variant="body5" className={classes["running-status"]}>
                Running
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {status?.RUNNING || 0}
              </Typography>
            </Box>
            <Box className={classes["status"]} sx={{ width: "15rem" }}>
              <Typography
                variant="body5"
                className={classes["schedule-status"]}
              >
                Schedule Stop
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {status?.SCHEDULED || 0}
              </Typography>
            </Box>
            <Box className={classes["status"]} sx={{ width: "8rem" }}>
              <Typography variant="body5" className={classes["idle-status"]}>
                Idle
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {status?.IDLE || 0}
              </Typography>
            </Box>
            <Box className={classes["status"]} sx={{ width: "11rem" }}>
              <Typography
                variant="body5"
                className={classes["breakdown-status"]}
              >
                Breakdown
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {status?.BREAKDOWN || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Box className={classes["machine"]}>
            <Typography variant="body6"> CRITICAL</Typography>
          </Box>
          <Box className={classes["container-flex"]}>
            <Box className={classes["status"]}>
              <Box className={classes["container-flex"]}>
                <img
                  src={Critical}
                  alt=""
                  style={{
                    height: "1.6rem",
                    width: "1.6rem",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body5"
                  className={classes["critical-status"]}
                >
                  Critical
                </Typography>
              </Box>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {status?.CRITICAL || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box className={classes["machine"]}>
            <Typography variant="body6">TARGET ACHIEVEMENT</Typography>
          </Box>
          <Box className={classes["container-flex"]}>
            <Box className={classes["status"]}>
              <Typography variant="body5" className={classes["running-status"]}>
                High
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {achieved?.high || 0}
              </Typography>
            </Box>
            <Box className={classes["status"]}>
              <Typography variant="body5" className={classes["idle-status"]}>
                Medium
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {achieved?.medium || 0}
              </Typography>
            </Box>
            <Box className={classes["status"]}>
              <Typography
                variant="body5"
                className={classes["breakdown-status"]}
              >
                Low
              </Typography>
              <Typography variant="body3" sx={{ color: TypePrimary }}>
                {achieved?.low || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          // border: "1px solid green",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="body3"
          sx={{ color: MarutiSilverDark, fontWeight: "400" }}
        >
          Production Date :{" "}
          {new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </Typography>
        <Filters
          filters={filters}
          domain={domain}
          onChange={onChange}
          onRefresh={onRefresh}
        />
      </Box>
    </Box>
  );
};

export default Status;
