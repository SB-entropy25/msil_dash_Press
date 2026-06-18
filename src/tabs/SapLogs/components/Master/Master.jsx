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
import _ from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { getSAPMaster } from "../../../../Repository/SapMasterRepository";
import { MarutiBlue500, MarutiWhite } from "../../../../utils/colors";
import {
  formArrResult,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";
import { getShiftStartTime } from "../../../../utils/helpers";
import useStyles from "../../SapLogs.styles";
import Filters from "./components/Filters/Filters";
import { masterColumn } from "./components/Table/MasterColumn";
import TableData from "./components/Table/TableData";

const initialFilters = {
  start_time: getShiftStartTime(),
  end_time: new Date(),
  status: [],
};

const initialDomain = {
  status: ["Success", "Failure", "In Process"],
  tabValue: "1",
};

const Master = forwardRef((props, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  const [domain, setDomain] = useState(initialDomain);
  const [clearFilter, setClearFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
  const [filteredData, setFilteredData] = useState([]);

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

  useImperativeHandle(ref, () => ({
    performAction(actionType) {
      if (actionType === "refresh") {
        fetchMasterData();
        setFilters({ ...filters, end_time: new Date() });
        return;
      }
    },
  }));

  useEffect(() => {
    fetchMasterData();
  }, [filters, shop]);

  const showToast = (message, type = "ERROR") => {
    const params = { open: true, message: message, type: type };
    dispatch(setApplicationAlert(params));
  };

  const fetchMasterData = () => {
    setLoading(true);
    const payload = {
      start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
      end_time: filters?.end_time
        ? formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss")
        : filters?.end_time,
      processing_status: formArrResult(formatStatus()),
    };
    getSAPMaster(payload)
      .then((res) => {
        setLoading(false);
        const list = _.get(res, ["data", "master"], []);
        setFilteredData(list || []);
      })
      .catch((error) => {
        setLoading(false);
        showToast("Error loading data");
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
    setFilters(changed);
  };

  const getTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {Object.entries(masterColumn).map(([columnId, column]) => {
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
    <Paper className="prodigi-paper" sx={{ flex: 1 }}>
      <Filters
        domain={domain}
        filters={filters}
        clearFilter={clearFilter}
        setClearFilter={setClearFilter}
        handleClearAll={handleClearAll}
        onChange={handleFiltersChange}
      />
      <TableLayout
        sx={{ flex: 1, mt: 1.4 }}
        loading={loading}
        className={classes["prodigi-table-dimensions"]}
      >
        <TableContainer className={classes["prodigi-table"]} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            {getTableHeader()}
            <TableBody className={classes["prodigi-table-body"]}>
              {filteredData?.map((rowData, index) => {
                return <TableData key={index} tableData={rowData} />;
              })}
            </TableBody>
          </Table>
          {!filteredData?.length && !loading && (
            <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
              <Typography style={{ color: MarutiBlue500 }}>
                {"No record found."}
              </Typography>
            </Box>
          )}
        </TableContainer>
      </TableLayout>
    </Paper>
  );
});

export default Master;
