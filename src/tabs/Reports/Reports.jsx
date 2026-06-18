import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Tab } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilters } from "../../redux/Actions/FiltersActions";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { selectFilters } from "../../redux/Selectors/FiltersSelector";
import { getShiftStartTime } from "../../utils/helpers";
import Downtime from "./components/Downtime/Downtime";
import Filters from "./components/Filters/Filters";
import Production from "./components/Production/Production";
import Quality from "./components/Quality/Quality";
import useStyles from "./Reports.styles";

const initialFilters = {
  machines: [],
  models: [],
  part_names: [],
  kpi: "All",
  shift: "All",
  start_time: getShiftStartTime(),
  end_time: new Date(),
};

const initialDomain = {
  machines: [],
  models: [],
  part_names: [],
  kpi: ["Efficiency", "SPH", "Production Quantity"],
  shifts: ["A", "B", "C"],
};
const Reports = () => {
  const classes = useStyles();
  const productionRef = useRef();
  const downtimeRef = useRef();
  const qualityRef = useRef();
  const [selectedTab, setSelectedTab] = useState("1");
  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
  const filtersDomain = useSelector(selectFilters)?.reports;
  const [domain, setDomain] = useState(initialDomain);
  const [kpi, setKpi] = useState("Efficiency");

  const shop = useSelector(getShop);

  const dispatch = useDispatch();

  useEffect(() => {
    if (shop && !_.isEmpty(shop)) {
      dispatch(fetchAllFilters("reports", shop?.id));
    }
  }, [shop]);

  useEffect(() => {
    const models = [...new Set(filtersDomain.map((x) => x.model))];
    const part_names = [...new Set(filtersDomain.map((x) => x.part_name))];
    const groupedData = _(filtersDomain)
      .groupBy("machine_group")
      .map((machines, label) => ({
        label: label,
        options: _.uniq(_.map(machines, "machine")),
      }))
      .value();
    setDomain({
      ...domain,
      machines: groupedData,
      models: models,
      part_names: part_names,
    });
  }, [filtersDomain]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    if (name !== "kpi") {
      const changed = _.cloneDeep(filters);
      changed[name] = value;
      switch (name) {
        case "machines": {
          let data = [];
          if (value?.length === 0) {
            data = filtersDomain;
          } else {
            data = filtersDomain?.filter((i) => value?.includes(i.machine));
          }
          const models = [...new Set(data.map((x) => x.model))];
          const part_names = [...new Set(data.map((x) => x.part_name))];
          setDomain({
            ...domain,
            models: models,
            part_names: part_names,
          });
          changed.models = [];
          changed.part_names = [];
          break;
        }
        case "models": {
          let data = [];
          if (filters?.machines?.length === 0) {
            data = filtersDomain;
          } else {
            data = filtersDomain?.filter((i) =>
              filters?.machines?.includes(i.machine)
            );
          }
          if (value?.length !== 0) {
            data = data?.filter((i) => value?.includes(i.model));
          }
          const part_names = [...new Set(data.map((x) => x.part_name))];
          setDomain({
            ...domain,
            part_names: part_names,
          });
          changed.part_names = [];
          break;
        }
        default:
          break;
      }
      setFilters(changed);
    } else {
      setKpi(value);
    }
  };

  const handleClearAll = (name) => {
    if (name === "kpi") {
      setKpi("Efficiency");
    } else {
      const changed = _.cloneDeep(filters);
      changed[name] = "";
      setFilters(changed);
    }
  };

  const handleRefresh = () => {
    if (selectedTab === "1") {
      productionRef.current.onRefresh();
    } else if (selectedTab === "2") {
      qualityRef.current.onRefresh();
    } else {
      downtimeRef.current.onRefresh();
    }
  };

  return (
    <Paper
      className="prodigi-paper reports-paper"
      sx={{
        minWidth: "-webkit-fill-available",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <TabContext value={selectedTab}>
        <Box sx={{ mb: 0 }} className={classes["container-flex"]}>
          <TabList onChange={handleChange} aria-label="dialog-tabs">
            <Tab label="Production" value="1" className="prodigi-tab" />
            <Tab label="Quality" value="2" className="prodigi-tab" />
            <Tab label="Downtime" value="3" className="prodigi-tab" />
          </TabList>
          <Box className={classes["quality-right-info"]}>
            <Filters
              selected={selectedTab}
              domain={domain}
              filters={filters}
              kpi={kpi}
              onChange={handleFiltersChange}
              handleClearAll={handleClearAll}
              onRefresh={handleRefresh}
            />
          </Box>
        </Box>
        <TabPanel
          value="1"
          sx={{
            display: selectedTab === "1" ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <Production ref={productionRef} filters={filters} kpi={kpi} />
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            display: selectedTab === "2" ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <Quality ref={qualityRef} filters={filters} />
        </TabPanel>
        <TabPanel
          value="3"
          sx={{
            display: selectedTab === "3" ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <Downtime ref={downtimeRef} filters={filters} />
        </TabPanel>
      </TabContext>
    </Paper>
  );
};
export default Reports;
