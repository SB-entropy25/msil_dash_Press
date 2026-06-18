import { Box } from "@mui/material";
import InitiationIcon from "../../../../assets/icons/initiate.svg";
import Loader from "../../../../components/Loader/Loader";

const Initiation = ({ loading = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: "20vh",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <img
          alt=""
          src={InitiationIcon}
          style={{
            width: "52.6rem",
            height: "15.3rem",
          }}
        />
      )}
    </Box>
  );
};
export default Initiation;
