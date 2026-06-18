import SquareIcon from "@mui/icons-material/Square";
import { Box, Typography } from "@mui/material";
import { MarutiBlack } from "../../utils/colors";
import useStyles from "./Legend.styles";

const DonutLegend = ({
  colors = [],
  shift = "-",
  isCnt = false,
  isQty = false,
  total = "0",
  data = [],
}) => {
  const classes = useStyles();
  const sumOfValues = data.reduce((acc, obj) => {
    if (obj.value !== undefined) {
      return acc + obj.value;
    } else {
      return acc;
    }
  }, 0);
  return (
    <Box
      sx={{
        minWidth: "14rem",
        height: "fit-content",
        // border:"1px solid red",
        width: "fit-content",
      }}
    >
      <Box className={classes["container-flex"]} sx={{ mt: 1.6, gap: "2rem" }}>
        <Typography
          variant="body1"
          sx={{ color: MarutiBlack, fontWeight: 600 }}
        >
          Shift {shift}
        </Typography>
        {isCnt && (
          <Typography
            variant="body1"
            sx={{ color: MarutiBlack, marginRight: "-3rem" }}
          >
            {isQty ? "Reason Count" : "Duration(min)"}
          </Typography>
        )}
      </Box>
      <Box className={classes["container-flex"]} sx={{ mt: 1.6, gap: "2rem" }}>
        <Typography variant="body2" sx={{ color: MarutiBlack }}>
          Total
        </Typography>
        <Typography variant="body2" sx={{ color: MarutiBlack }}>
          {typeof sumOfValues === "number" ? sumOfValues?.toFixed(2) : "0"}
        </Typography>
      </Box>
      {data?.map((item, index) => {
        return (
          <Box
            key={index}
            className={classes["container-flex-start"]}
            sx={{ mt: 0.6, gap: "2rem" }}
          >
            <Box
              key={index}
              className={classes["container-flex-start"]}
              sx={{ gap: 0.6 }}
            >
              <SquareIcon
                fontSize="medium"
                sx={{ color: colors[index % colors.length] }}
              />
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

export default DonutLegend;
