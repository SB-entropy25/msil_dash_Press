import { Box, DialogContent, Divider, Typography } from "@mui/material";
import { Grey10, TypeSecondary } from "../../utils/colors";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../DialogCard/DialogCard.component";
import Loader from "../Loader/Loader";

const AreYouSure = ({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  clickaway = false,
  message = "",
  loading = false,
}) => {
  return (
    <DialogCard
      open={open}
      handleClose={onClose}
      maxWidth={"xs"}
      fullWidth={true}
      title={"Alert"}
      sx={{ color: TypeSecondary }}
      main={{
        "& .MuiPaper-root": {
          width: "28rem !important",
        },
      }}
      variant="h4"
      clickaway={clickaway}
    >
      <DialogContent>
        <Box
          sx={{
            padding: "1.6rem",
            backgroundColor: Grey10,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              color: TypeSecondary,
              whiteSpace: "break-spaces",
            }}
          >
            {message}
          </Typography>
        </Box>
        <Divider sx={{ mt: 1.2, mb: 1.2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <SecondaryButton disabled={loading} onClick={onSubmit}>
            {loading ? <Loader size="SMALL" /> : <>Yes</>}
          </SecondaryButton>
          <PrimaryButton onClick={onClose}>No</PrimaryButton>
        </Box>
      </DialogContent>
    </DialogCard>
  );
};
export default AreYouSure;
