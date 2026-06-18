import { DialogActions, DialogContent, Divider } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import * as sessionReducer from "../../redux/Reducers/SessionReducer";
import { handleLogout } from "../../services/auth";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import DialogCard from "../DialogCard/DialogCard.component";

const SessionExpired = (props) => {
  const show = useSelector(sessionReducer.getSessionStatus);

  return (
    <DialogCard
      open={show}
      maxWidth={"sm"}
      fullWidth={true}
      title={"Session Expired"}
    >
      <Divider style={{ marginLeft: "1rem", marginRight: "1rem" }} />
      <DialogContent>
        <br />
        <span className="font-regular">
          Your session has expired. <br />
          Please login again to continue working.
        </span>
      </DialogContent>
      <DialogActions
        style={{ position: "relative", right: "2rem", marginBottom: "0rem" }}
      >
        <div></div>
        <div className="dialog-buttons" style={{ marginBottom: "0rem" }}>
          <div
            className="dialog-button-submit"
            style={{ marginBottom: "0rem" }}
          >
            <PrimaryButton type="button" onClick={handleLogout}>
              Login
            </PrimaryButton>
          </div>
        </div>
      </DialogActions>
      <br />
    </DialogCard>
  );
};

export default SessionExpired;
