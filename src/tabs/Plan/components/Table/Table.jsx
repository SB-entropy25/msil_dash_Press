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
import SortDisableIcon from "../../../../assets/icons/SortDisable.svg";
import SortDownIcon from "../../../../assets/icons/sortDown.svg";
import SortUpIcon from "../../../../assets/icons/sortUp.svg";
import Loader from "../../../../components/Loader/Loader";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { setUploadPlanStatus } from "../../../../redux/Actions/PlanActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { selectPlanStatus } from "../../../../redux/Selectors/PlanSelector";
import { getPlan } from "../../../../Repository/PlanRepository";
import { MarutiBlue500 } from "../../../../utils/colors";
import {
  formatDateTime,
  getPageSize,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import {
  statusColor,
  statusMapper,
  statusOppMapper,
} from "../../../../utils/mapper";
import useStyles from "../../Plan.styles";

const columnWidth = {
  machine: "9%",
  model: "9%",
  part_name: "9%",
  pe_code: "9%",
  work_order_no: "9%",
  production_date: "9%",
  shift: "9%",
  priority: "9%",
  planned_qty: "9%",
  actual_qty: "9%",
  status: "9%",
};
const Table = forwardRef(
  ({ filters, sort = null, setSort = () => {} }, ref) => {
    const classes = useStyles();

    const [endMessage, setEndMessage] = useState("");
    const [loader, setLoader] = useState(true);
    const [end, setEnd] = useState(false);
    const [payload, setPayload] = useState({});
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();

    const status = useSelector(selectPlanStatus);
    const shop = useSelector(getShop);

    useImperativeHandle(ref, () => ({
      onRefresh,
    }));

    const onRefresh = () => {
      // alert("REFRESH");
      if (payload && !_.isEmpty(payload)) {
        setPage(1);
        setData([]);
        setLoader(true);
        fetchData(payload, 1);
      }
    };

    useEffect(() => {
      if (status === "UPLOADED") {
        setPage(1);
        setData([]);
        setLoader(true);
        fetchData(payload, 1);
        dispatch(setUploadPlanStatus("IDLE"));
      }
    }, [status]);

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
          pe_code_list: listResult(filters?.pe_codes),
          production_date_list: listResult(filters?.production_dates),
          shift: selectResult(filters?.shift),
          priority: selectResult(filters?.priority),
          status: selectResult(statusMapper[filters?.status]),
          sort_priority: sort,
        };
        setPayload(payload);
      }
    }, [filters, sort, shop]);

    useEffect(() => {
      if (
        payload &&
        !_.isEmpty(payload) &&
        Object.keys(payload)?.length === 10
      ) {
        fetchData(payload, 1);
      }
    }, [payload]);

    const fetchData = (payload, pg_no) => {
      var params = payload;
      params.page_no = pg_no;
      params.page_size = getPageSize();
      getPlan(params)
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
                <TableCell align="left" sx={{ width: columnWidth.pe_code }}>
                  PE Code
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ width: columnWidth.work_order_no }}
                >
                  Work Order No.
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ width: columnWidth.production_date }}
                >
                  Production Date
                </TableCell>
                <TableCell align="left" sx={{ width: columnWidth.shift }}>
                  Shift
                </TableCell>
                <TableCell align="left" sx={{ width: columnWidth.priority }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Priority
                    {sort === null && (
                      <img
                        style={{
                          cursor: "pointer",
                          height: "1.2rem",
                          width: "auto",
                          marginLeft: "1rem",
                        }}
                        src={SortDisableIcon}
                        onClick={() => setSort("asc")}
                        alt=""
                      />
                    )}
                    {sort === "asc" && (
                      <img
                        style={{
                          cursor: "pointer",
                          height: "1.2rem",
                          width: "auto",
                          marginLeft: "1rem",
                        }}
                        src={SortDownIcon}
                        onClick={() => setSort("desc")}
                        alt=""
                      />
                    )}
                    {sort === "desc" && (
                      <img
                        style={{
                          cursor: "pointer",
                          height: "1.2rem",
                          width: "auto",
                          marginLeft: "1rem",
                        }}
                        src={SortUpIcon}
                        onClick={() => setSort(null)}
                        alt=""
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="left" sx={{ width: columnWidth.planned_qty }}>
                  Planned Qty
                </TableCell>
                <TableCell align="left" sx={{ width: columnWidth.actual_qty }}>
                  Actual Prod.Qty
                </TableCell>
                <TableCell align="left" sx={{ width: columnWidth.status }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes["prodigi-table-body"]}>
              {data?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ width: columnWidth.machine }}>
                      {item?.machine}
                    </TableCell>
                    <TableCell align="center" sx={{ width: columnWidth.model }}>
                      {item?.model}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.part_name }}
                    >
                      {item?.part_name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.pe_code }}>
                      {item?.pe_code}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.work_order_no }}
                    >
                      {item?.work_order_no}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.production_date }}
                    >
                      {formatDateTime(
                        new Date(item?.production_date),
                        "DD-MM-YY"
                      )}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.shift }}>
                      {item?.shift}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.priority }}
                    >
                      {item?.priority}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.planned_qty }}
                    >
                      {item?.planned_qty}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.actual_qty }}
                    >
                      {item?.actual_qty}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: columnWidth.status,
                        color: statusColor[statusOppMapper[item?.status]],
                      }}
                    >
                      {statusOppMapper[item?.status]}
                    </TableCell>
                  </TableRow>
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
  }
);
export default Table;
