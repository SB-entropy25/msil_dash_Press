import { Box, Typography } from "@mui/material";
import BarIcon from "../../../../assets/icons/bar.png";
import MultiBarChart from "../../../../components/Charts/MultiBarChart";
import IconAlert from "../../../../components/IconAlert/IconAlert";
import { Grey7, TypeSecondary } from "../../../../utils/colors";

const SingleMachine = ({ data = [], date = "", shift = "All" }) => {
  return (
    <Box
      sx={{
        border: `1px solid ${Grey7}`,
        mt: "1.6rem",
        flex: 1,
        borderRadius: "0.4rem",
        padding: "1.4rem 1.2rem",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="body1" sx={{ color: TypeSecondary }}>
        {date}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {data?.length > 0 ? (
          <MultiBarChart shift={shift} data={data} color={"#293095"} />
        ) : (
          <IconAlert title="Chart data not found">
            <img
              alt=""
              src={BarIcon}
              style={{ height: "100%", maxHeight: "20rem", maxWidth: "20rem" }}
            />
          </IconAlert>
        )}
      </Box>
    </Box>
  );
};

export default SingleMachine;
