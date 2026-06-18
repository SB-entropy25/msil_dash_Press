import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader/Loader";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { fetchStopTime } from "../../../../redux/Actions/DowntimeActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { getDowntime } from "../../../../Repository/DowntimeRepository";
import { MarutiBlue500 } from "../../../../utils/colors";
import {
  formatDateTime,
  getPageSize,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Downtime.styles";
import TableData from "./TableData";

const columnWidth = {
  machine: "7%",
  model: "7%",
  part_name: "7%",
  start_time: "10%",
  end_time: "10%",
  duration: "7%",
  reason: "7%",
  remarks: "10%",
  uploaded_by: "7%",
};
const Table = forwardRef(({ filters }, ref) => {
  const classes = useStyles();

  const [endMessage, setEndMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [end, setEnd] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const shop = useSelector(getShop);

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  const onRefresh = () => {
    if (payload && !_.isEmpty(payload)) {
      setPage(1);
      setData([]);
      setLoader(true);
      fetchData(payload, 1);
      dispatch(fetchStopTime(payload));
    }
  };

  useEffect(() => {
    if (filters && !_.isEmpty(shop)) {
      setPage(1);
      setData([]);
      setLoader(true);
      const payload = {
        shop_id: shop?.id,
        machine_list: listResult(filters?.machines),
        model_list: listResult(filters?.models),
        part_name_list: listResult(filters?.part_names),
        start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
        end_time: filters?.end_time
          ? formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss")
          : filters?.end_time,
        shift: selectResult(filters?.shift),
        duration: selectResult(filters?.duration),
        reason: selectResult(filters?.reason),
        remarks: selectResult(filters?.remarks),
      };
      setPayload(payload);
      dispatch(fetchStopTime(payload));
    }
  }, [filters, shop]);

  useEffect(() => {
    if (payload && !_.isEmpty(payload) && Object.keys(payload)?.length === 10) {
      fetchData(payload, 1);
    }
  }, [payload]);

  const fetchData = (payload, pg_no) => {
    var params = payload;
    params.page_no = pg_no;
    params.page_size = getPageSize();

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

  return (
    <TableLayout
      loading={false}
      className={classes["prodigi-table-dimensions"]}
    >
      <TableContainer
        onScroll={loadMoreHandle}
        className={classes["prodigi-table"]}
      >
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ width: columnWidth.machine }}>
                Machine
              </TableCell>
              <TableCell align="center" sx={{ width: columnWidth.model }}>
                Model
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.part_name }}>
                Part Name
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.start_time }}>
                Start Time
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.end_time }}>
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
              <TableCell align="left" sx={{ width: columnWidth.uploaded_by }}>
                Updated by
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
  );
});
export default Table;
