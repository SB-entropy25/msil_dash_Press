import { Box, Paper } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectShopMachines } from "../../redux/Selectors/ProductionSelector";
import MachineStatus from "./components/MachineStatus/MachineStatus.component";
import Status from "./components/Status/Status.component";
import useStyles from "./Shopview.styles";

const initialFilters = {
  machines: [],
  view: true,
};

const initialDomain = {
  machines: [],
};

const Shopview = () => {
  const classes = useStyles();

  const [filters, setFilters] = useState(initialFilters);
  const [domain, setDomain] = useState(initialDomain);
  const machines = useSelector(selectShopMachines);
  const childRef = useRef();

  const handleFiltersChange = (event) => {
    const { name, value, checked } = event.target;
    const changed = _.cloneDeep(filters);
    changed[name] = name === "view" ? checked : value;
    setFilters(changed);
  };

  useEffect(() => {
    if (machines.length) {
      const groupedData = _(machines)
        .groupBy("machine_group")
        .map((machinesList, label) => ({
          label: label,
          options: _.uniq(_.map(machinesList, "machine")),
        }))
        .value();
      groupedData.unshift({
        label: "All",
        options: _.uniq(_.map(machines, "machine")),
      });
      setDomain({ ...domain, machines: groupedData });
    }
    return () => {};
  }, [machines]);

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
        className={classes["shop-sections"]}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <Status
          filters={filters}
          domain={domain}
          onChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
        <MachineStatus ref={childRef} filters={filters} />
      </Box>
    </Paper>
  );
};
export default Shopview;
