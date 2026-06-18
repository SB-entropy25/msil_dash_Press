import {
  Box,
  DialogContent,
  Divider,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DialogCard from "../../../../components/DialogCard/DialogCard.component";
import Loader from "../../../../components/Loader/Loader";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { fetchRemarks } from "../../../../redux/Actions/DowntimeActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { selectDowntimeTotalStopTime } from "../../../../redux/Selectors/DowntimeSelector";
import { getDowntime } from "../../../../Repository/DowntimeRepository";
import {
  MarutiBlack,
  MarutiBlue500,
  TypeSecondary,
} from "../../../../utils/colors";
import { formatDateTime } from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Production.styles";
import ContentBox from "../ContentBox/ContentBox";
import TableData from "./TableData";

const columnWidth = {
  model: "7%",
  part_name: "7%",
  start: "10%",
  end: "10%",
  duration: "7%",
  reason: "7%",
  remarks: "12%",
};

const DowntimePunching = ({
  open,
  onClose,
  clickaway = false,
  production = {},
  initialPayload = {},
  machine = {},
}) => {
  const classes = useStyles();

  const [endMessage, setEndMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [end, setEnd] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  const stopTime = useSelector(selectDowntimeTotalStopTime);

  useEffect(() => {
    if (!_.isEmpty(shop) && !_.isEmpty(initialPayload)) {
      dispatch(fetchRemarks(shop?.id));
      setPage(1);
      setData([]);
      setLoader(true);
      const payload = {
        ...initialPayload,
      };
      setPayload(payload);
    }
  }, [shop, initialPayload]);

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload, 1);
    }
  }, [payload]);

  const fetchData = (payload, pg_no) => {
    var params = payload;
    params.page_no = pg_no;
    params.page_size = 20;

    getDowntime(params)
      .then((res) => {
        var list = _.get(res, ["data"], []);
        if (list.length === 0) {
          setEnd(true);
          if (pg_no === 1) {
            setEndMessage("Records not available");
          } else {
            setEndMessage("No more records");
          }
        } else {
          if (pg_no > 1) {
            let res = [...data, ...list];
            setData(res);
          } else {
            setData(list);
          }
          setEnd(false);
          setEndMessage("");
        }
        setLoader(false);
      })
      .catch((ex) => {
        const params = {
          open: true,
          message: "Error loading data",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const loadMoreHandle = (event) => {
    if (!loader) {
      let bottom =
        event.target.offsetHeight + event.target.scrollTop >
        event.target.scrollHeight;
      if (bottom && !end) {
        let pg = page + 1;
        setLoader(true);
        fetchData(payload, pg);
        setPage(pg);
      }
    }
  };

  const handleChangeUpdatedBy = (index, value) => {
    const list = _.cloneDeep(data);
    list[index] = { ...list[index], updated_by: value };
    setData(list);
  };

  const getDescription = () => {
    return (
      <span>
        Machine: <strong>{machine.value}</strong>
      </span>
    );
  };

  return (
    <DialogCard
      clickaway={clickaway}
      open={open}
      handleClose={onClose}
      maxWidth={"md"}
      fullWidth={true}
      title={"Downtime Punching"}
      description={getDescription()}
      sx={{ color: TypeSecondary }}
      closable={true}
    >
      <DialogContent>
        <Divider sx={{ mb: "1.2rem" }} />
        <Box className={classes["container-flex"]}>
          <Box className={classes["container-flex-start"]}>
            <ContentBox
              type="PRIMARY"
              label="Date"
              value={formatDateTime(production?.date, "DD-MM-YYYY")}
            />
            <ContentBox
              type="PRIMARY"
              label="Shift"
              value={production?.shift}
            />
          </Box>
          <Box
            className={classes["prodigi-red-info"]}
            sx={{ width: "fit-content" }}
          >
            <Typography
              sx={{
                color: MarutiBlack,
                width: "fit-content",
                whiteSpace: "nowrap",
              }}
            >
              Total Stop Time: <strong>{stopTime} mins</strong>
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: "1.2rem", mt: "1.6rem" }} />
        <TableLayout
          loading={false}
          className={classes["prodigi-dialog-table-dimensions"]}
        >
          <TableContainer
            onScroll={loadMoreHandle}
            className={`${classes["prodigi-dialog-table"]} prodigi-dialog-table`}
            sx={{ overflowX: "hidden" }}
          >
            <MuiTable stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: columnWidth.model }}>
                    Model
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.part_name }}>
                    Part Name
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.start }}>
                    Start Time
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.end }}>
                    End Time
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.duration }}>
                    Duration (Min)
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.reason }}>
                    Reason
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.remarks }}>
                    Remarks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes["prodigi-table-body"]}>
                {data?.map((item, index) => {
                  return (
                    <TableData
                      key={index}
                      index={index}
                      row={item}
                      columnWidth={columnWidth}
                      onChange={handleChangeUpdatedBy}
                    />
                  );
                })}
              </TableBody>
            </MuiTable>
            {loader && (
              <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
                <Loader size="SMALL" />
              </Box>
            )}
            {end && !loader && (
              <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
                <Typography style={{ color: MarutiBlue500 }}>
                  {endMessage}
                </Typography>
              </Box>
            )}
          </TableContainer>
        </TableLayout>
      </DialogContent>
    </DialogCard>
  );
};

export default DowntimePunching;
