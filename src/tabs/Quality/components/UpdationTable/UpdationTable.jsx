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
import {
  fetchReasons,
  fetchTotalRework,
} from "../../../../redux/Actions/QualityActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { getQualityRework } from "../../../../Repository/QualityRepository";
import { MarutiBlue500 } from "../../../../utils/colors";
import {
  formatDateTime,
  getPageSize,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Quality.styles";
import TableData from "./TableData";

const columnWidth = {
  machine: "7%",
  part_name: "12%",
  shift: "5%",
  start_time: "10%",
  end_time: "10%",
  batch_id: "7%",
  prod_qty: "7%",
  rework_qty: "7%",
  prework_qty: "8%",
  status: "8%",
  pro_updation: "8%",
};

const Table = forwardRef(({ filters }, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [endMessage, setEndMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [end, setEnd] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState({});
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
      dispatch(fetchTotalRework(payload));
    }
    if (!_.isEmpty(shop) && shop?.id) {
      const obj = {
        shop_id: shop?.id,
        for_rework: "UPDATION",
      };
      dispatch(fetchReasons(obj));
    }
  };

  useEffect(() => {
    if (!_.isEmpty(shop) && shop?.id) {
      const obj = {
        shop_id: shop?.id,
        for_rework: "UPDATION",
      };
      dispatch(fetchReasons(obj));
    }
  }, [shop]);

  useEffect(() => {
    if (filters && !_.isEmpty(shop)) {
      setPage(1);
      setData([]);
      setLoader(true);
      const payload = {
        machine_list: listResult(filters?.machines),
        model_list: listResult(filters?.models),
        part_name_list: listResult(filters?.part_names),
        start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
        end_time: formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss"),
        batch: selectResult(filters?.batch_id),
        status: selectResult(filters?.status),
        shift: selectResult(filters?.shift),
        shop_id: shop?.id,
      };
      setPayload(payload);
    }
  }, [filters, shop]);

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload, 1);
      dispatch(fetchTotalRework(payload));
    }
  }, [payload]);

  const fetchData = (payload, pg_no) => {
    var params = payload;
    params.page_no = pg_no;
    params.page_size = getPageSize();
    getQualityRework(params)
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

  const handleUpdate = () => {
    setPage(1);
    setData([]);
    setLoader(true);
    fetchData(payload, 1);
  };

  return (
    <TableLayout
      loading={false}
      className={classes["prodigi-table-dimensions"]}
    >
      <TableContainer
        className={classes["prodigi-table"]}
        onScroll={loadMoreHandle}
      >
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ width: columnWidth.machine }}>
                Machine
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.part_name }}>
                Part Name
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.shift }}>
                Shift
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.start_time }}>
                Start Time
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.end_time }}>
                End Time
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.batch_id }}>
                Batch ID
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.prod_qty }}>
                Actual Prod.Qty
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.rework_qty }}>
                Rework Qty
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.prework_qty }}>
                Pending Rework Qty
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.status }}>
                Status
              </TableCell>
              <TableCell align="left" sx={{ width: columnWidth.pro_updation }}>
                Update
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
                  onSubmitSuccess={handleUpdate}
                  // reworkUpdation={reworkUpdation}
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
