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
  downloadSAPProduction,
  getSAPProduction,
  getSAPProductionFilters,
  getSAPProductionPassRate,
} from "../../../../Repository/SapProductionRepository";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { MarutiWhite } from "../../../../utils/colors";
import {
  formArrResult,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";
import { getMachineGroups, getShiftStartTime } from "../../../../utils/helpers";
import useStyles from "../../SapLogs.styles";
import BottomContainer from "../BottomContainer";
import DownloadSapProgress from "../DownloadSapProgress";
import Filters from "./components/Filters/Filters";
import { productionColumn } from "./components/Table/ProductionColumn";
import TableData from "./components/Table/TableData";

const initialFilters = {
  machines: [],
  program_no: [],
  program_name: [],
  models: [],
  shifts: [],
  start_time: getShiftStartTime(),
  end_time: new Date(),
  status: [],
};

const initialDomain = {
  machines: [],
  models: [],
  shifts: ["A", "B", "C"],
  status: ["In Process", "Success", "Failure"],
  tabValue: "1",
};

const Production = forwardRef(({ updateRateInfo }, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  const [domain, setDomain] = useState(initialDomain);
  const [tempDomain, setTempDomain] = useState(initialDomain);
  const [clearFilter, setClearFilter] = useState(true);
  const [machineData, setMachineData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDownload, setOpenDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
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
          item = "FAILURE";
        }
        if (item === "In Process") {
          item = "IN_PROCESS";
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
      machine: formArrResult(filters?.machines),
      program_no: formArrResult(filters?.program_no),
      program_name: formArrResult(filters?.program_name),
      model: formArrResult(filters?.models),
      start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
      end_time: filters?.end_time
        ? formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss")
        : filters?.end_time,
      shift: formArrResult(filters?.shifts),
      status: formArrResult(formatStatus()),
    };
  }, [filters, shop]);

  useImperativeHandle(ref, () => ({
    performAction(actionType) {
      if (actionType === "refresh") {
        fetchProductionData(1);
        fetchPassRate();
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
    if (!_.isEmpty(shop) && shop?.id) {
      fetchProductionFilters();
      fetchProductionData(1);
      fetchPassRate();
    }
  }, [shop]);

  useEffect(() => {
    if (!_.isEmpty(shop) && shop?.id) {
      fetchProductionData(1);
      fetchPassRate();
    }
  }, [filters]);

  const showToast = (message, type = "ERROR") => {
    const params = { open: true, message: message, type: type };
    dispatch(setApplicationAlert(params));
  };

  const fetchProductionFilters = () => {
    getSAPProductionFilters(shop?.id)
      .then((res) => {
        const data = _.get(res, ["data", "machine"], []);

        if (Array.isArray(data)) {
          const groupedData = getMachineGroups(data, "machine_name");
          let programs = [];
          data?.map((item) => {
            const arr = item?.program?.map((x) => x);
            arr?.map((p) => programs.push(p));
            return item;
          });
          const program_no = programs.map((x) => x.program_no);
          const program_name = programs.map((x) => x.program_name);
          let models = [];
          programs.map((pro) => {
            pro.models?.map((p) => models.push(p));
            return pro;
          });
          setMachineData(data);
          setProgramData(programs);
          const obj = {
            ...domain,
            machines: [...new Set(groupedData)],
            program_no: [...new Set(program_no)],
            program_name: [...new Set(program_name)],
            models: [...new Set(models)],
          };
          setDomain(obj);
          setTempDomain(obj);
        }
      })
      .catch((error) => {
        showToast("Error loading data");
      });
  };

  const fetchProductionData = (pageNo = page) => {
    setPage(pageNo);
    if (pageNo === 1) {
      setLoading(true);
    }
    getSAPProduction({ ...payload, page_size: 30, page_no: pageNo })
      .then((res) => {
        setLoading(false);
        const list = _.get(res, ["data", "production"], []);
        if (list.length === 0) {
          setEnd(true);
          if (pageNo === 1) {
            setFilteredData([]);
            setEndMessage("Records not available");
          } else {
            setEndMessage("No more records");
          }
        } else {
          if (pageNo > 1) {
            let resList = [...filteredData, ...list];
            setFilteredData(resList);
          } else {
            setFilteredData(list || []);
          }
          setEnd(false);
          setEndMessage("");
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoading(false);
        setLoader(false);
        setEndMessage("");
        showToast("Error loading data");
      });
  };

  const fetchPassRate = () => {
    getSAPProductionPassRate(payload)
      .then((res) => {
        updateRateInfo(res?.data || {});
      })
      .catch((error) => {});
  };

  const loadMoreHandle = (event) => {
    if (!loader) {
      let bottom =
        event.target.offsetHeight + event.target.scrollTop >
        event.target.scrollHeight;
      if (bottom && !end) {
        let pg = page + 1;
        setLoader(true);
        fetchProductionData(pg);
      }
    }
  };

  const downloadProductionReport = async () => {
    return downloadSAPProduction(payload, {
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
    const tempMachines = [...machineData];
    let tempPrograms = [...programData];
    let arrProgramNo = tempDomain.program_no || [];
    let arrProgramName = tempDomain.program_name || [];
    let arrModels = tempDomain.models || [];
    if (filters.machines?.length) {
      let arrFilterMachines = tempMachines.filter((a) =>
        filters.machines.includes(a.machine_name)
      );
      let arrPrograms = [];
      arrFilterMachines?.map((item) => {
        const arr = item?.program?.map((x) => x);
        arr?.map((p) => arrPrograms.push(p));
        return item;
      });
      tempPrograms = arrPrograms;
      arrProgramNo = arrPrograms.map((x) => x.program_no);
      arrProgramName = arrPrograms.map((x) => x.program_name);
      let tempArrModels = [];
      arrPrograms?.map((pro) => {
        pro.models?.map((p) => tempArrModels.push(p));
        return pro;
      });
      arrModels = tempArrModels;
    }
    switch (name) {
      case "machines": {
        let programs = [];
        if (value.length) {
          let machine = tempMachines?.filter((x) =>
            value.includes(x.machine_name)
          );
          machine.map((item) => {
            const arr = item?.program?.map((x) => x);
            arr?.map((p) => programs.push(p));
          });
          const program_no = programs.map((x) => x.program_no);
          const program_name = programs.map((x) => x.program_name);
          let models = [];
          programs.map((pro) => {
            pro.models?.map((p) => models.push(p));
            return pro;
          });
          setDomain({
            ...domain,
            program_no: [...new Set(program_no)],
            program_name: [...new Set(program_name)],
            models: [...new Set(models)],
          });
        } else {
          setDomain({ ...tempDomain });
        }
        break;
      }
      case "program_no": {
        if (value.length) {
          const filterPro = tempPrograms?.filter((item) =>
            value.includes(item.program_no)
          );
          const program_name = filterPro.map((x) => x.program_name);
          let models = [];
          filterPro?.map((pro) => {
            pro.models?.map((p) => models.push(p));
            return pro;
          });
          setDomain({
            ...domain,
            program_name: [...new Set(program_name)],
            models: [...new Set(models)],
          });
        } else {
          setDomain({
            ...tempDomain,
            program_no: [...new Set(arrProgramNo)],
            program_name: [...new Set(arrProgramName)],
            models: [...new Set(arrModels)],
          });
        }
        break;
      }
      case "program_name": {
        if (value.length) {
          const filterPro = tempPrograms?.filter((item) =>
            value.includes(item.program_name)
          );
          let models = [];
          filterPro?.map((pro) => {
            pro.models?.map((p) => models.push(p));
            return pro;
          });
          setDomain({ ...domain, models: [...new Set(models)] });
        } else {
          setDomain({
            ...tempDomain,
            program_name: [...new Set(arrProgramName)],
            models: [...new Set(arrModels)],
          });
        }
        break;
      }
      default:
        break;
    }
    setFilters(changed);
  };

  const getTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {Object.entries(productionColumn).map(([columnId, column]) => {
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
                {filteredData?.map((rowData, index) => {
                  return (
                    <TableData
                      key={index}
                      tableData={rowData}
                      filters={filters}
                      filteredData={filteredData}
                      handleUpdateSuccess={() => fetchProductionData(1)}
                    />
                  );
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
          endpoint={downloadProductionReport}
          logType={"ProductionLog"}
          onClose={() => setOpenDownload(false)}
        />
      )}
    </Box>
  );
});

export default Production;
