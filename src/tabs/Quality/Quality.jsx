import { Box, Paper } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilters } from "../../redux/Actions/FiltersActions";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { selectFilters } from "../../redux/Selectors/FiltersSelector";
import { getMachineGroups, getShiftStartTime } from "../../utils/helpers";
import Filters from "./components/Filters/Filters";
import Tabs from "./components/Tabs/Tabs";

const initialFilters = {
  models: [],
  machines: [],
  part_names: [],
  batch_id: "All",
  hold_qty: "All",
  status: "All",
  shift: "All",
  start_time: getShiftStartTime(),
  end_time: new Date(),
};

const initialDomain = {
  machines: [],
  models: [],
  part_names: [],
  batch_id: [],
  priority: [],
  shifts: ["A", "B", "C"],
  status: ["Pending", "Completed"],
  tabValue: "1",
  hold_qty: ["0", ">0"],
};

const Quality = () => {
  const dispatch = useDispatch();
  const childRef = useRef();

  const [filters, setFilters] = useState({
    ...initialFilters,
    end_time: new Date(),
  });
  const [domain, setDomain] = useState(initialDomain);
  const [clearFilter, setClearFilter] = useState(true);

  const shop = useSelector(getShop);
  const filtersDomain = useSelector(selectFilters)?.quality;

  useEffect(() => {
    if (!_.isEmpty(shop) && shop?.id) {
      dispatch(fetchAllFilters("quality", shop?.id));
    }
  }, [shop]);

  useEffect(() => {
    const models = [...new Set(filtersDomain.map((x) => x.model))];
    const part_names = [...new Set(filtersDomain.map((x) => x.part_name))];
    const batch = [...new Set(filtersDomain.map((x) => x.Batch))]?.sort();
    const groupedData = getMachineGroups(filtersDomain);
    setDomain({
      ...domain,
      machines: groupedData,
      models: models,
      part_names: part_names,
      batch_id: batch,
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
        const batch = [...new Set(data.map((x) => x.Batch))]?.sort();
        setDomain({
          ...domain,
          models: models,
          part_names: part_names,
          batch_id: batch,
        });
        changed.models = [];
        changed.part_names = [];
        changed.batch_id = "All";
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
        const batch = [...new Set(data.map((x) => x.Batch))]?.sort();
        setDomain({
          ...domain,
          part_names: part_names,
          batch_id: batch,
        });
        changed.part_names = [];
        changed.batch_id = "All";
        break;
      }
      case "part_names": {
        let data = [];
        if (filters?.machines?.length === 0) {
          data = filtersDomain;
        } else {
          data = filtersDomain?.filter((i) =>
            filters?.machines?.includes(i.machine)
          );
        }
        if (filters?.models?.length !== 0) {
          data = data?.filter((i) => filters?.models?.includes(i.model));
        }
        if (value?.length !== 0) {
          data = data?.filter((i) => value?.includes(i.part_name));
        }
        const batch = [...new Set(data.map((x) => x.Batch))]?.sort();
        setDomain({
          ...domain,
          batch_id: batch,
        });
        changed.batch_id = "All";
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
  const handleTab = (tabId) => {
    setFilters({
      ...filters,
      tabValue: tabId,
    });
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
          onRefresh={handleRefresh}
        />
        <Tabs ref={childRef} filters={filters} handleTab={handleTab} />
      </Box>
    </Paper>
  );
};
export default Quality;
