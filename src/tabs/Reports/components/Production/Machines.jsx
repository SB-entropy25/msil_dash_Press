import { useEffect, useState } from "react";
import { productionMachineMapper } from "../mappers";
import Overall from "./Overall";

const colors = ["#293095", "#3E47BE", "#6770DE", "#9CA2F4", "#C1C5F8"];

const Machines = ({
  data = [],
  kpi = "Efficiency",
  onBarClick = () => {},
  loading = false,
}) => {
  const [graphData, setGraphData] = useState([]);
  const [allowed, setAllowed] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (data && data?.length > 0) {
      const data1 = data[2];
      if (data1) {
        const { list, set, machines } = productionMachineMapper(
          data1,
          kpi,
          colors
        );
        setAllowed([...machines]);
        setList([...set]);
        setGraphData(list);
      }
    }
  }, [kpi, data]);

  return (
    <Overall
      loading={loading}
      data={graphData}
      bars={allowed}
      groups={list}
      onBarClick={onBarClick}
      colors={colors}
    />
  );
};

export default Machines;
