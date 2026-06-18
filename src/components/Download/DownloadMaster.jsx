import { Fragment } from "react";
import { useSelector } from "react-redux";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { downloadMaster } from "../../Repository/MasterRepository";
import DownloadProgress from "../DownloadProgress/DownloadProgress.component";

const Download = ({ file = "", open = false, handleClose = () => {} }) => {
  const shop = useSelector(getShop);

  const downloadAPI = (options) => {
    const payload = {
      shop_id: shop?.id,
      file_type: "Master",
      file_path: file,
      file_name: file,
    };
    return downloadMaster(payload, options);
  };

  return (
    <Fragment>
      {open && (
        <DownloadProgress
          clickaway={false}
          open={open}
          endpoint={downloadAPI}
          downloadName={"Master"}
          onClose={handleClose}
        />
      )}
    </Fragment>
  );
};
export default Download;
