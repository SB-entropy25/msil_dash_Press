import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import React from "react";
import {
  Green,
  Grey30,
  MarutiBlack,
  Red,
  TypeSecondary,
  Yellow,
  Yellow2,
} from "../../../../utils/colors";
import useStyles from "./MachineStatusCard.styles";

function MachineStatusCard({ item, handleTarget = () => {} }) {
  const classes = useStyles();
  const { target_percent, target, actual } = item;
  let targetPercent = actual >= target ? 100 : target_percent;
  targetPercent = targetPercent > 100 ? 100 : targetPercent;
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      width="50%"
      sx={{
        padding: "1.2rem",
        height: "50%",
        paddingBottom: "0",
        "&:nth-of-type(even)": { paddingLeft: "0" },
      }}
    >
      <Box
        className={classes["barder-box-item"]}
        sx={{ cursor: "pointer" }}
        onClick={() => handleTarget(item)}
      >
        <Box height="20%" className={classes["box-item-title"]}>
          <Typography variant="body3" sx={{ color: TypeSecondary }}>
            {item.machine_name}
          </Typography>

          {item.critical === 1 && (
            <Typography
              variant="body5"
              className={classes["critical-status"]}
              sx={{ fontWeight: "400", marginLeft: "0.8rem" }}
            >
              Critical
            </Typography>
          )}
        </Box>

        <Box height="30%" className={classes["box-item-progress-container"]}>
          <Box className={classes["box-item-flex"]}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="body2"
                sx={{ color: MarutiBlack, fontWeight: 600 }}
              >
                {Math.trunc(item.actual)}
              </Typography>
              <Typography variant="body2" sx={{ color: MarutiBlack }}>
                Actual
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                sx={{ color: MarutiBlack, fontWeight: 600 }}
              >
                {Math.trunc(item?.target)}
              </Typography>
              <Typography variant="body2" sx={{ color: MarutiBlack }}>
                Target
              </Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: "0.4rem" }}>
            <LinearProgress
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    item.status === "RUNNING"
                      ? Green
                      : item?.status === "IDLE"
                      ? Yellow
                      : item?.status === "SCHEDULED"
                      ? Yellow2
                      : Red,
                },
                height: "0.6rem",
                borderRadius: "0.4rem",
              }}
              variant="determinate"
              value={targetPercent}
            />
          </Box>
        </Box>

        <Box
          height="25%"
          className={classes["box-item-flex"]}
          sx={{ borderBottom: `1px solid ${Grey30}` }}
        >
          <Box className={classes["machine-card-item"]}>
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              SPH
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: TypeSecondary, fontWeight: 600 }}
            >
              {item?.sph?.toFixed(2) > 0 ? item?.sph?.toFixed(2) : 0}
            </Typography>
          </Box>
          <Divider orientation="vertical" sx={{ borderColor: Grey30 }} />
          <Box className={classes["machine-card-item"]}>
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              Efficiency
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: TypeSecondary, fontWeight: 600 }}
            >
              {item?.efficiency?.toFixed(2)} %
            </Typography>
          </Box>
        </Box>

        <Box height="25%" className={classes["box-item-flex"]}>
          <Box className={classes["machine-card-item"]}>
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              Downtime
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: TypeSecondary, fontWeight: 600 }}
            >
              {item?.downtime?.toFixed()} min
            </Typography>
          </Box>
          <Divider orientation="vertical" sx={{ borderColor: Grey30 }} />
          <Box className={classes["machine-card-item"]}>
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              Scheduled Stop
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: TypeSecondary, fontWeight: 600 }}
            >
              {item?.planned_stop?.toFixed()} min
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default MachineStatusCard;
