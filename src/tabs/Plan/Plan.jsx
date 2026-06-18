import { Box, Paper } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilters } from "../../redux/Actions/FiltersActions";
import { fetchPlanAlerts } from "../../redux/Actions/PlanActions";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { selectFilters } from "../../redux/Selectors/FiltersSelector";
import { getHighestAndCreateList } from "../../utils/helperFunctions.utils";
import Filters from "./components/Filters/Filters";
import Table from "./components/Table/Table";
import useStyles from "./Plan.styles";
import { getMachineGroups } from "../../utils/helpers";

const initialDomain = {
  machines: [],
  models: [],
  part_names: [],
  pe_codes: [],
  priority: [],
  shifts: ["A", "B", "C"],
  status: ["Planned", "Running", "Paused", "Completed", "Short closed"],
};

const initialFilters = {
  machines: [],
  models: [],
  part_names: [],
  pe_codes: [],
  production_dates: [],
  shift: "All",
  priority: "All",
  status: "All",
};

const Plan = () => {
  const classes = useStyles();
  const childRef = useRef();

  const [sort, setSort] = useState(null);
  const [domain, setDomain] = useState(initialDomain);
  const [filters, setFilters] = useState(initialFilters);

  const dispatch = useDispatch();

  const shop = useSelector(getShop);
  const filtersDomain = useSelector(selectFilters)?.plan;

  useEffect(() => {
    if (shop && shop?.id) {
      dispatch(fetchAllFilters("plan", shop?.id));
      dispatch(
        fetchPlanAlerts({
          shop_id: shop?.id,
        })
      );
    }
  }, [shop]);

  useEffect(() => {
    const models = [...new Set(filtersDomain.map((x) => x.model))];
    const part_names = [...new Set(filtersDomain.map((x) => x.part_name))];
    const pe_codes = [...new Set(filtersDomain.map((x) => x.pe_code))];
    const priority = getHighestAndCreateList([
      ...new Set(filtersDomain.map((x) => x.priority_max)),
    ]);
    const groupedData = getMachineGroups(filtersDomain);
    setDomain({
      ...domain,
      machines: groupedData,
      models: models,
      part_names: part_names,
      pe_codes: pe_codes,
      priority: priority,
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
        const pe_codes = [...new Set(data.map((x) => x.pe_code))];
        const priority = getHighestAndCreateList([
          ...new Set(data.map((x) => x.priority_max)),
        ]);
        setDomain({
          ...domain,
          models: models,
          part_names: part_names,
          pe_codes: pe_codes,
          priority: priority,
        });
        changed.models = [];
        changed.part_names = [];
        changed.pe_codes = [];
        changed.priority = "All";
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
        const pe_codes = [...new Set(data.map((x) => x.pe_code))];
        const priority = getHighestAndCreateList([
          ...new Set(data.map((x) => x.priority_max)),
        ]);
        setDomain({
          ...domain,
          part_names: part_names,
          pe_codes: pe_codes,
          priority: priority,
        });
        changed.part_names = [];
        changed.pe_codes = [];
        changed.priority = "All";
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

        const pe_codes = [...new Set(data.map((x) => x.pe_code))];
        const priority = getHighestAndCreateList([
          ...new Set(data.map((x) => x.priority_max)),
        ]);
        setDomain({
          ...domain,
          pe_codes: pe_codes,
          priority: priority,
        });
        changed.pe_codes = [];
        changed.priority = "All";
        break;
      }
      case "pe_codes": {
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
        if (filters?.part_names?.length !== 0) {
          data = data?.filter((i) =>
            filters?.part_names?.includes(i.part_name)
          );
        }
        if (value?.length !== 0) {
          data = data?.filter((i) => value?.includes(i.pe_code));
        }

        const priority = getHighestAndCreateList([
          ...new Set(data.map((x) => x.priority_max)),
        ]);
        setDomain({
          ...domain,
          priority: priority,
        });
        changed.priority = "All";
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
        className={classes["plan-sections"]}
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
          sort={sort}
          onRefresh={handleRefresh}
        />
        <Table
          ref={childRef}
          filters={filters}
          sort={sort}
          setSort={(val) => setSort(val)}
        />
      </Box>
    </Paper>
  );
};
export default Plan;
