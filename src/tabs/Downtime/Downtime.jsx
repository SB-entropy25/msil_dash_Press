import { Box, Paper } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRemarks } from "../../redux/Actions/DowntimeActions";
import { fetchAllFilters } from "../../redux/Actions/FiltersActions";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { selectFilters } from "../../redux/Selectors/FiltersSelector";
import { getMachineGroups, getShiftStartTime } from "../../utils/helpers";
import Filters from "./components/Filters/Filters";
import Table from "./components/Table/Table";
import useStyles from "./Downtime.styles";

const initialDomain = {
  machines: [],
  models: [],
  part_names: [],
  shifts: ["A", "B", "C"],
  durations: ["0-5 mins", "5-10 mins", "10-30 mins", ">30 mins"],
  reasons: [],
  remarks: [],
};

const initialFilters = {
  machines: [],
  models: [],
  part_names: [],
  start_time: getShiftStartTime(),
  end_time: "",
  shift: "All",
  duration: "All",
  reason: "All",
  remarks: "All",
};
const Downtime = () => {
  const classes = useStyles();
  const childRef = useRef();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    ...initialFilters,
  });
  const [domain, setDomain] = useState(initialDomain);

  const shop = useSelector(getShop);
  const filtersDomain = useSelector(selectFilters)?.downtime;

  useEffect(() => {
    if (shop && shop?.id) {
      dispatch(fetchAllFilters("downtime", shop?.id));
      dispatch(fetchRemarks(shop?.id));
    }
  }, [shop]);

  useEffect(() => {
    const models = [...new Set(filtersDomain.map((x) => x.model))];
    const part_names = [...new Set(filtersDomain.map((x) => x.part_name))];
    const remarks = [...new Set(filtersDomain.map((x) => x.remark))];
    const reasons = [...new Set(filtersDomain.map((x) => x.reason))];
    const groupedData = getMachineGroups(filtersDomain);
    setDomain({
      ...domain,
      machines: groupedData,
      models: models,
      part_names: part_names,
      remarks: remarks.sort(),
      reasons: reasons.sort(),
    });
  }, [filtersDomain]);

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
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
      case "reason": {
        let remarks = [];
        if (value === "All") {
          remarks = [...new Set(filtersDomain.map((x) => x.remark))];
        } else {
          let data = filtersDomain?.filter((i) => i?.reason === value);
          remarks = [...new Set(data.map((x) => x.remark))]?.sort();
        }
        setDomain({
          ...domain,
          remarks: remarks?.sort(),
        });
        changed.remarks = "All";
        break;
      }
      default:
        break;
    }
    setFilters(changed);
  };

  const handleClearAll = (name) => {
    const changed = _.cloneDeep(filters);
    changed[name] = "";
    setFilters(changed);
  };

  const handleRefresh = () => {
    childRef.current.onRefresh();
  };

  return (
    <Paper
      className="prodigi-paper"
      sx={{
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Box
        className={classes["downtime-sections"]}
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
          onChange={handleFiltersChange}
          handleClearAll={handleClearAll}
          onRefresh={handleRefresh}
        />
        <Table ref={childRef} filters={filters} />
      </Box>
    </Paper>
  );
};
export default Downtime;
