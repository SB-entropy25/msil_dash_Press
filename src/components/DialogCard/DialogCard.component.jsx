import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogTitle } from "@mui/material";
import { TypeSecondary } from "../../utils/colors.js";
import useStyles from "./DialogCard.styles.js";

const DialogCard = ({
  open = false,
  fullWidth = false,
  maxWidth = "sm",
  children,
  handleClose,
  closable = true,
  variant = "h5",
  color = TypeSecondary,
  title,
  clickaway = true,
  sx = {},
  main = {},
  description = <></>,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={clickaway ? handleClose : () => {}}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className="prodigi-dialog"
      aria-labelledby="dialog-title"
      sx={{ ...main }}
      {...props}
    >
      <DialogTitle
        id="dialog-title"
        className={classes["dialog-title-container"]}
        color={color}
        variant={variant}
        sx={{ ...sx }}
      >
        {title}
        {description}
        <Box className="dialog-header-buttons">
          {closable && (
            <CloseIcon
              sx={{ color: TypeSecondary, cursor: "pointer" }}
              onClick={handleClose}
            />
          )}
        </Box>
      </DialogTitle>
      {children}
    </Dialog>
  );
};
export default DialogCard;
