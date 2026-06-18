import SquareIcon from "@mui/icons-material/Square";
import { Box, Typography } from "@mui/material";
import { MarutiBlack } from "../../utils/colors";
import useStyles from "./Tooltip.styles";

const BarTooltip = ({ title = "", data = [] }) => {
  const classes = useStyles();

  return (
    <Box
      sx={{
        width: "14rem",
        height: "fit-content",
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: MarutiBlack, fontWeight: 600, mb: 1 }}
      >
        {title}
      </Typography>
      {data?.map((item, index) => {
        return (
          <Box
            key={index}
            className={classes["container-flex-start"]}
            sx={{ mt: 0.6 }}
          >
            <Box
              key={index}
              className={classes["container-flex-start"]}
              sx={{ gap: 0.6 }}
            >
              <SquareIcon fontSize="medium" sx={{ color: item?.color }} />
              <Typography variant="body2" sx={{ color: MarutiBlack }}>
                {item?.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: MarutiBlack }}>
              {typeof item?.value === "number" ? item?.value?.toFixed(2) : "0"}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BarTooltip;
