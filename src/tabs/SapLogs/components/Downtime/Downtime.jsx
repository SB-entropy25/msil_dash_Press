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
  downloadSAPDowntime,
  getSAPDowntime,
  getSAPDowntimeFilters,
} from "../../../../Repository/SapDowntimeRepository";
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
import { downtimeColumn } from "./components/Table/DowntimeColumn";
import TableData from "./components/Table/TableData";

const initialFilters = {
  header_material: [],
  work_center: [],
  start_time: getShiftStartTime(),
  end_time: new Date(),
  reasons: [],
  shifts: [],
  status: [],
};

const initialDomain = {
  header_material: [],
  work_center: [],
  reasons: [],
  shifts: ["A", "B", "C"],
  status: ["Success", "Failure"],
  tabValue: "1",
};
const Downtime = forwardRef((props, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  const [domain, setDomain] = useState(initialDomain);
  const [tempDomain, setTempDomain] = useState(initialDomain);
  const [clearFilter, setClearFilter] = useState(true);
  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
  const [downtimeData, setDowntimeData] = useState([]);
  const [reasonData, setReasonData] = useState([]);
  const [openDownload, setOpenDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(1);
  const [endMessage, setEndMessage] = useState("");

  const formatStatus = () => {
    if (filters?.status?.length) {
      const data = filters?.status?.map((item) => {
        if (item === "Success") {
          item = "SUCCESS";
        }
        if (item === "Failure") {
          item = "FAILED";
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
      header_material: formArrResult(filters?.header_material),
      work_center: formArrResult(filters?.work_center),
      start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
      end_time: filters?.end_time
        ? formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss")
        : filters?.end_time,
      reason: formArrResult(filters?.reasons),
      remarks: formArrResult(filters?.remarks),
      shift: formArrResult(filters?.shifts),
      data_sent_flag: formArrResult(formatStatus()),
      page_size: 30,
    };
  }, [filters, shop]);

  useImperativeHandle(ref, () => ({
    performAction(actionType) {
      if (actionType === "refresh") {
        fetchDowntimeData(1);
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
      fetchDowntimeFilters();
      fetchDowntimeData(1);
    }
  }, [shop]);

  useEffect(() => {
    if (shop?.id) {
      fetchDowntimeData(1);
    }
  }, [filters]);

  const showToast = (message, type = "ERROR") => {
    const params = { open: true, message: message, type: type };
    dispatch(setApplicationAlert(params));
  };

  const fetchDowntimeFilters = () => {
    getSAPDowntimeFilters(shop?.id)
      .then((res) => {
        const resData = _.get(res, ["data"], {});
        let remarks = [];
        const reason = resData["reasons"]?.map((item) => {
          item?.remarks?.map((p) => remarks.push(p));
          return item?.reason;
        });
        const obj = {
          ...domain,
          header_material: resData["header_material"] || [],
          work_center: resData["work_center"] || [],
          reasons: reason || [],
          remarks: resData["remarks"] || [],
        };
        setReasonData(resData["reasons"]);
        setDomain(obj);
        setTempDomain(obj);
      })
      .catch((error) => {
        showToast("Error loading data");
      });
  };

  const fetchDowntimeData = (pageNo = page) => {
    setPage(pageNo);
    if (pageNo === 1) {
      setLoading(true);
    }
    getSAPDowntime({ ...payload, page_no: pageNo })
      .then((res) => {
        const list = _.get(res, ["data", "downtime"], []);
        if (list.length === 0) {
          setEnd(true);
          if (pageNo === 1) {
            setDowntimeData([]);
            setEndMessage("Records not available");
          } else {
            setEndMessage("No more records");
          }
        } else {
          if (pageNo > 1) {
            let resList = [...downtimeData, ...list];
            setDowntimeData(resList);
          } else {
            setDowntimeData(list || []);
          }
          setEnd(false);
          setEndMessage("");
        }
        setLoading(false);
        setLoader(false);
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
        fetchDowntimeData(pg);
      }
    }
  };

  const downloadDowntimeReport = () => {
    return downloadSAPDowntime(payload, {
      responseType: "blob",
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const handleClearAll = (name) => {
    const changed = _.cloneDeep(filters);
    changed[name] = "";
    setFilters(changed);
  };

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    const changed = _.cloneDeep(filters);
    changed[name] = value;

    switch (name) {
      case "reasons": {
        if (value.length) {
          let remarks = [];
          reasonData?.map((item) => {
            if (value?.includes(item?.reason)) {
              item?.remarks?.map((p) => remarks.push(p));
            }
            return item;
          });
          setDomain({ ...domain, remarks });
        } else {
          setDomain({ ...tempDomain });
        }
        break;
      }
    }
    setFilters(changed);
  };

  const getTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {Object.entries(downtimeColumn).map(([columnId, column]) => {
            let headerStyle = {
              zIndex: 2,
              backgroundColor: MarutiWhite,
              wordWrap: "break-word",
              overflowWrap: "anywhere",
              width: `${column.width}vw`,
              minWidth: `${column.width}vw`,
              maxWidth: `${column.width}vw`,
            };
            return (
              <TableCell key={columnId} align="center" sx={headerStyle}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    cursor: "pointer",
                  }}
                >
                  {column.name}
                </Box>
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
        handleClearAll={handleClearAll}
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
                {downtimeData?.map((rowData, index) => {
                  return <TableData key={index} tableData={rowData} />;
                })}
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
          endpoint={downloadDowntimeReport}
          logType={"DowntimeLog"}
          onClose={() => setOpenDownload(false)}
        />
      )}
    </Box>
  );
});

export default Downtime;
