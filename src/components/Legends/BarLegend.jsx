import SquareIcon from "@mui/icons-material/Square";
import { Box, Typography } from "@mui/material";
import { TypeSecondary } from "../../utils/colors";
import useStyles from "./Legend.styles";

const BarLegend = ({
  colors = [],
  label = "",
  bars = [],
  lines = [],
  sx = {},
}) => {
  const classes = useStyles();
  return (
    <Box
      className={classes["container-flex"]}
      sx={{
        ...sx,
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: TypeSecondary, fontWeight: 400 }}
      >
        {label}
      </Typography>
      <Box className={classes["container-flex"]} sx={{ gap: 1 }}>
        {bars?.map((item, index) => (
          <Box
            key={index}
            className={classes["container-flex"]}
            sx={{ gap: 0.5 }}
          >
            <SquareIcon
              fontSize="medium"
              sx={{ color: colors[index % colors.length] }}
            />
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              {item}
            </Typography>
          </Box>
        ))}
        {lines?.map((item, index) => (
          <Box
            key={index}
            className={classes["container-flex"]}
            sx={{ gap: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="4"
              viewBox="0 0 10 4"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 3.66732H0V0.333984H10V3.66732Z"
                fill={colors[index % colors.length]}
              />
            </svg>
            <Typography variant="body2" sx={{ color: TypeSecondary }}>
              {item?.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default BarLegend;
