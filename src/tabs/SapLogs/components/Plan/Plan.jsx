import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import _ from "lodash";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadSAPPlan,
  getSAPPlan,
  getSAPPlanFilters,
} from "../../../../Repository/SapPlanRepository";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { MarutiWhite } from "../../../../utils/colors";
import {
  formArrResult,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";
import { getShiftStartTime } from "../../../../utils/helpers";
import useStyles from "../../SapLogs.styles";
import BottomContainer from "../BottomContainer";
import DownloadSapProgress from "../DownloadSapProgress";
import Filters from "./components/Filters/Filters";
import { planColumns } from "./components/Table/PlanColumns";
import TableData from "./components/Table/TableData";

const initialDomain = {
  order_status: ["REL", "TECO"],
  order_type: ["ZPRS", "ZIMM", "ZTRL"],
  work_center: [],
  status: ["Order updated in IOT", "Order not updated", "Order Rejected"],
  tabValue: "1",
};

const initialFilters = {
  order_status: [],
  order_type: [],
  work_center: [],
  start_time: getShiftStartTime(),
  end_time: new Date(),
  status: [],
};

const Plan = forwardRef((props, ref) => {
  const [domain, setDomain] = useState(initialDomain);
  const [clearFilter, setClearFilter] = useState(true);
  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
  const [filteredData, setFilteredData] = useState([]);
  const [openDownload, setOpenDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorLogs, setErrorLogs] = useState({});
  const [loader, setLoader] = useState(false);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(1);
  const [endMessage, setEndMessage] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  const formatStatus = () => {
    if (filters?.status?.length) {
      const data = filters?.status?.map((item) => {
        if (item === "Order updated in IOT") {
          item = "ORDER_ACCEPTED";
        }
        if (item === "Order Rejected") {
          item = "ORDER_REJECTED";
        }
        if (item === "Order not updated") {
          item = "ORDER_SAVED";
        }
        return item;
      });
      return data;
    }
    return undefined;
  };

  const payload = useMemo(() => {
    return {
      iot_shop_id: shop?.id,
      work_center: formArrResult(filters?.work_center),
      scheduled_start: formatDateTime(
        filters?.start_time,
        "YYYY-MM-DD HH:mm:ss"
      ),
      scheduled_finish: filters?.end_time
        ? formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss")
        : filters?.end_time,
      order_status: formArrResult(filters?.order_status),
      order_type: formArrResult(filters?.order_type),
      iot_order_processing_status: formArrResult(formatStatus()),
      page_size: 30,
    };
  }, [filters, shop]);

  useImperativeHandle(ref, () => ({
    performAction(actionType) {
      if (actionType === "refresh") {
        fetchPlanData(1);
        setFilters({ ...filters, end_time: new Date() });
        return;
      }
      if (actionType === "download") {
        setOpenDownload(true);
        return;
      }
    },
  }));

  useEffect(() => {
    if (shop?.id) {
      fetchPlanFilters();
      fetchPlanData(1);
    }
  }, [shop]);

  useEffect(() => {
    if (shop?.id) {
      fetchPlanData(1);
    }
  }, [filters]);

  const showToast = (message, type = "ERROR") => {
    const params = { open: true, message: message, type: type };
    dispatch(setApplicationAlert(params));
  };

  const fetchPlanFilters = () => {
    getSAPPlanFilters(shop?.id)
      .then((res) => {
        const list = _.get(res, ["data", "work_center"], []);
        setDomain({ ...domain, work_center: list });
      })
      .catch((error) => {
        showToast("Error loading data");
      });
  };

  const fetchPlanData = (pageNo = page) => {
    setPage(pageNo);
    if (pageNo === 1) {
      setLoading(true);
    }
    getSAPPlan({ ...payload, page_no: pageNo })
      .then((res) => {
        const list = _.get(res, ["data", "plan"], []);
        const errlogs = _.get(res, ["data", "error_logs"], {});
        if (list.length === 0) {
          setEnd(true);
          if (pageNo === 1) {
            setFilteredData([]);
            setErrorLogs({});
            setEndMessage("Records not available");
          } else {
            setEndMessage("No more records");
          }
        } else {
          if (pageNo > 1) {
            let resList = [...filteredData, ...list];
            setErrorLogs({ ...errorLogs, ...errlogs });
            setFilteredData(resList);
          } else {
            setErrorLogs(errlogs);
            setFilteredData(list || []);
          }
          setEnd(false);
          setEndMessage("");
        }
        setLoader(false);
        setLoading(false);
      })
      .catch((error) => {
        showToast("Error loading data");
        setLoading(false);
        setLoader(false);
        setEndMessage("");
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
        fetchPlanData(pg);
      }
    }
  };

  const downloadPlanReport = () => {
    return downloadSAPPlan(payload, {
      responseType: "blob",
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    const changed = _.cloneDeep(filters);
    changed[name] = value;
    setFilters(changed);
  };

  const getTableHeader = () => {
    const fixedCell = {
      position: "sticky",
      zIndex: 3,
      backgroundColor: MarutiWhite,
      wordWrap: "break-word",
      overflowWrap: "anywhere",
      width: `7vw`,
      minWidth: `7vw`,
      maxWidth: `7vw`,
    };
    const borderStyle = {
      borderRight: "5px solid #E6E9F0",
      boxShadow: "2px 0px 2px -2px rgba(0, 0, 0, 0.2)",
    };
    return (
      <TableHead>
        <TableRow>
          <TableCell
            align="left"
            sx={{
              ...fixedCell,
              width: `10vw`,
              minWidth: `10vw`,
              maxWidth: `10vw`,
              left: "0vw",
            }}
          >
            <div>{"Data received time"}</div>
          </TableCell>
          <TableCell align="left" sx={{ ...fixedCell, left: "10vw" }}>
            <div>{"Order Number"}</div>
          </TableCell>
          <TableCell align="left" sx={{ ...fixedCell, left: "17vw" }}>
            <div>{"Order Status"}</div>
          </TableCell>
          <TableCell align="left" sx={{ ...fixedCell, left: "24vw" }}>
            <div>{"Order Type"}</div>
          </TableCell>
          <TableCell align="left" sx={{ ...fixedCell, left: "31vw" }}>
            <div>{"MRP Controller"}</div>
          </TableCell>
          <TableCell
            align="left"
            sx={[{ ...fixedCell, left: "38vw" }, borderStyle]}
          >
            <div>{"Work Center"}</div>
          </TableCell>
          {Object.entries(planColumns).map(([columnId, column]) => {
            let headerStyle = {
              backgroundColor: MarutiWhite,
              wordWrap: "break-word",
              overflowWrap: "anywhere",
              width: `${column?.width}vw`,
              minWidth: `${column?.width}vw`,
              maxWidth: `${column?.width}vw`,
              zIndex: 1,
            };

            return (
              <TableCell key={columnId} align="left" sx={headerStyle}>
                <div>{column.name}</div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Filters
        domain={domain}
        filters={filters}
        clearFilter={clearFilter}
        setClearFilter={setClearFilter}
        onChange={handleFiltersChange}
      />
      <Box
        sx={{
          mt: 1.4,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <TableLayout
          sx={{ flex: 1 }}
          loading={loading}
          className={classes["prodigi-table-dimensions"]}
        >
          <TableContainer
            component={Paper}
            onScroll={loadMoreHandle}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "auto",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              {getTableHeader()}
              <TableBody>
                {filteredData?.map((row, index) => (
                  <TableData
                    key={index}
                    tableData={row}
                    errorLogs={errorLogs}
                  />
                ))}
              </TableBody>
            </Table>
            <BottomContainer
              loader={loader && !loading}
              end={end}
              endMessage={endMessage}
            />
          </TableContainer>
        </TableLayout>
      </Box>
      {openDownload && (
        <DownloadSapProgress
          clickaway={false}
          open={openDownload}
          endpoint={downloadPlanReport}
          logType={"PlanLog"}
          onClose={() => setOpenDownload(false)}
        />
      )}
    </Box>
  );
});

export default Plan;
