import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

const ArrowTooltip = ({ message = "", children, show = false }) => {
  return (
    <>
      {show ? (
        <Tooltip title={message} arrow>
          {children}
        </Tooltip>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
export default ArrowTooltip;
