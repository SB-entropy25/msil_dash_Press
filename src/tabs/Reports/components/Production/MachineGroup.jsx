import { useEffect, useState } from "react";
import { productionMapper } from "../mappers";
import Overall from "./Overall";

const colors = ["#293095", "#3E47BE", "#6770DE", "#9CA2F4", "#C1C5F8"];

const MachineGroup = ({
  data = [],
  kpi = "Efficiency",
  onBarClick = () => {},
  loading = false,
}) => {
  const [graphData, setGraphData] = useState([]);
  const [allowed, setAllowed] = useState([]);

  useEffect(() => {
    if (data && data?.length > 0) {
      const data1 = data[0];
      if (data1) {
        const { list, set } = productionMapper(data1, kpi, colors);
        setAllowed([...set]);
        setGraphData(list);
      }
    }
  }, [kpi, data]);

  return (
    <Overall
      loading={loading}
      data={graphData}
      bars={allowed}
      groups={allowed?.map((x) => x.name)}
      onBarClick={onBarClick}
      colors={colors}
    />
  );
};

export default MachineGroup;
