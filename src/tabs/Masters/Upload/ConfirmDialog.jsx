import { Box, DialogContent } from "@mui/material";
import { Fragment, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../../App";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../../../components/DialogCard/DialogCard.component";
import Loader from "../../../components/Loader/Loader";
import { setApplicationAlert } from "../../../redux/Actions/AlertActions";
import {
  changeAddMasterApiStatus,
  uploadMasterFile,
} from "../../../redux/Actions/MasterActions";
import { getAddMasterApiStatus } from "../../../redux/Reducers/PressShopMasterReducer";
import {
  getLocation,
  getPlant,
  getShop,
  getSite,
} from "../../../redux/Reducers/PressShopReducer";
import { getUser } from "../../../services/auth";
import { MarutiWhite } from "../../../utils/colors";

const ConfirmDialog = (props) => {
  const dispatch = useDispatch();
  const shop = useSelector(getShop);
  const site = useSelector(getSite);
  const plant = useSelector(getPlant);
  const location = useSelector(getLocation);
  const uploadApiStatus = useSelector(getAddMasterApiStatus);
  const context = useContext(ProdigiContext);
  const { fetchWorkflowCount } = context;

  const handleUpload = () => {
    let manager = getUser()?.manager;
    let managerId = getUser()?.managerId;
    if (!manager || !managerId || manager === "" || managerId === "") {
      const params = {
        open: true,
        message: "Reviewer details are missing. Please contact support team.",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
      props.handleClose();
    } else {
      if (shop && plant && location && site) {
        var cred = getUser()?.username?.split("\\");
        var receiver = managerId.split("\\");
        if (cred && receiver) {
          let userId;
          let userName;
          if (cred.length === 1) {
            userId = cred[0];
            userName = cred[0];
          } else {
            userId = cred[0] + "%5C" + cred[1];
            userName = cred[1];
          }
          let receiverId;
          let receiverName;
          if (receiver.length === 1) {
            receiverId = receiver[0];
            receiverName = receiver[0];
          } else {
            receiverId = receiver[0] + "%5C" + receiver[1];
            receiverName = receiver[1];
          }
          var payload = {
            shop_id: shop?.id,
            shop_name: shop?.shop_name,
            plant_name: plant?.plant_name,
            location_name: location?.location_name,
            site_name: site?.site_name,
            module_name: "Digiprod",
            uploader_id: getUser()?.username,
            uploader_name: getUser()?.username,
            uploader_email: getUser().email,
            reviewer_id: receiverId,
            reviewer_name: receiverName,
            reviewer_email: manager,
            // reviewer_id: "dilpreet",
            // reviewer_name: "dilpreet",
            // reviewer_email: "dilpreet.singh03@nagarro.com",
            file: props.file,
          };
          dispatch(uploadMasterFile(payload));
        }
      }
    }
  };

  useEffect(() => {
    if (uploadApiStatus === "COMPLETED") {
      fetchWorkflowCount();
    }
    if (uploadApiStatus === "FAILED" || uploadApiStatus === "COMPLETED") {
      props.handleClose();
      dispatch(changeAddMasterApiStatus("NOT IN USE"));
    }
  }, [uploadApiStatus]);

  return (
    <Fragment>
      <DialogCard
        open={props.open}
        handleClose={props.handleClose}
        maxWidth={"xs"}
        fullWidth={true}
        title={"Are you sure?"}
        main={{
          "& .MuiPaper-root": {
            width: "28rem !important",
          },
        }}
        variant="h4"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              gap: "1rem",
              mt: 1,
            }}
          >
            <SecondaryButton type="button" onClick={props.handleClose}>
              No
            </SecondaryButton>
            {uploadApiStatus === "INPROGRESS" ? (
              <PrimaryButton>
                <Loader size="small" color="white" loaderColor={MarutiWhite} />
              </PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={handleUpload}>
                Yes
              </PrimaryButton>
            )}
          </Box>
        </DialogContent>
      </DialogCard>
    </Fragment>
  );
};
export default ConfirmDialog;
