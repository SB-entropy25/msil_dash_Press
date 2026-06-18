import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../App";
import RefreshIcon from "../../assets/icons/Refresh.svg";
import TableLayout from "../../components/TableLayout/TableLayout";
import { fetchAllMasterFiles } from "../../redux/Actions/MasterActions";
import {
  getApprovedFile,
  getMasterFiles,
  getMasterFilesStatus,
} from "../../redux/Reducers/PressShopMasterReducer";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import useStyles from "./Master.styles";
import MasterData from "./MasterData";
import Upload from "./Upload/Upload";

const columnWidth = {
  version: "6%",
  masterfile: "12%",
  uploadedby: "8%",
  uploadedon: "10%",
  receivedby: "8%",
  receivedon: "10%",
  status: "10%",
  download: "1%",
};

const Master = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openUpload, setOpenUpload] = useState(false);
  const files = useSelector(getMasterFiles);
  const shop = useSelector(getShop);
  const loading = useSelector(getMasterFilesStatus);
  const approvedFile = useSelector(getApprovedFile);
  const context = useContext(ProdigiContext);
  const { fetchWorkflowCount } = context;

  useEffect(() => {
    fetchWorkflowCount();
  }, []);

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  useEffect(() => {
    if (shop?.id) {
      dispatch(fetchAllMasterFiles({ shop_id: shop?.id }));
    }
  }, [shop]);

  const handleRefresh = () => {
    if (shop?.id) {
      dispatch(fetchAllMasterFiles({ shop_id: shop?.id }));
    }
  };

  const onUpload = () => {};

  const getTableHeaders = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell align="left" style={{ width: columnWidth.version }}>
            Serial No.
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.masterfile }}>
            Master File Name
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.uploadedby }}>
            Uploaded by
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.uploadedon }}>
            Uploaded on
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.receivedon }}>
            Sent for review at
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.receivedby }}>
            Reviewer
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.receivedon }}>
            Reviewed at
          </TableCell>
          <TableCell align="left" style={{ width: columnWidth.status }}>
            Status
          </TableCell>
          {/* <TableCell align="center" style={{ width: columnWidth.download }}>
            Download
          </TableCell> */}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <Paper
      className="prodigi-paper"
      sx={{
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Box className={classes["container-flex"]}>
        <Typography variant="h3" color="Grey.main" sx={{ fontWeight: "bold" }}>
          MASTER FILES
        </Typography>
        <Box className={classes["container-flex"]} sx={{ gap: 0.8 }}>
          {/* <Upload /> */}
          <img
            onClick={handleRefresh}
            src={RefreshIcon}
            alt=""
            style={{ height: "3.2rem", width: "3.2rem", cursor: "pointer" }}
          />
        </Box>
      </Box>
      <TableLayout
        sx={{ flex: 1, mt: 1.6 }}
        loading={loading}
        className={classes["prodigi-table-dimensions"]}
      >
        <TableContainer className={classes["prodigi-table"]} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            {getTableHeaders()}
            <TableBody className={classes["prodigi-table-body"]}>
              {files?.map((row, index) => (
                <MasterData
                  key={index}
                  columnWidth={columnWidth}
                  row={row}
                  approved={approvedFile}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableLayout>
      {openUpload && (
        <Upload
          open={openUpload}
          onUpload={onUpload}
          handleClose={handleCloseUpload}
        />
      )}
    </Paper>
  );
};
export default Master;
