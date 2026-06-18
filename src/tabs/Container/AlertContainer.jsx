import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../components/Snackbar/Snackbar";
import { setApplicationAlert } from "../../redux/Actions/AlertActions";
import { selectAlert } from "../../redux/Selectors/AlertSelector";

const AlertContainer = () => {
  const { open, message, type } = useSelector(selectAlert);
  const dispatch = useDispatch();

  const handleClose = () => {
    const payload = {
      open: false,
      message: "",
      type: "ERROR",
    };
    dispatch(setApplicationAlert(payload));
  };

  return (
    <Box>
      <Alert
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        type={type}
        onClose={handleClose}
        message={message}
      />
    </Box>
  );
};
export default AlertContainer;
