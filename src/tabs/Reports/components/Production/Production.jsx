import { Box, Typography } from "@mui/material";
import _ from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportGraph } from "../../../../Repository/ReportsRepository";
import BackIcon from "../../../../assets/icons/back.svg";
import CustomSwitch from "../../../../components/Switch/CustomSwitch";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { MarutiBlue500, TypeSecondary } from "../../../../utils/colors";
import {
  formatDateTime,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Reports.styles";
import {
  productionSingleMachineMapper,
  productionSingleMapper,
} from "../mappers";
import MachineGroup from "./MachineGroup";
import Machines from "./Machines";
import SingleMachine from "./SingleMachine";

const Production = forwardRef(({ filters = {}, kpi = "Efficiency" }, ref) => {
  const classes = useStyles();
  const [selected, setSelected] = useState("overall");
  const [singleGraphData, setSingleGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const [data, setData] = useState([]);
  const shop = useSelector(getShop);
  const [single, setSingle] = useState({});
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(true);

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  const onRefresh = () => {
    if (payload && !_.isEmpty(payload)) {
      setSelected("overall");
      setSingleGraphData([]);
      setLoading(true);
      fetchData(payload);
    }
  };

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload);
    }
  }, [payload]);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (filters && !_.isEmpty(shop)) {
      setSelected("overall");
      setSingleGraphData([]);
      setLoading(true);
      const payload = {
        machine_list: listResult(filters?.machines),
        model_list: listResult(filters?.models),
        part_name_list: listResult(filters?.part_names),
        start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD"),
        end_time: formatDateTime(filters?.end_time, "YYYY-MM-DD"),
        shift: selectResult(filters?.shift),
        shop_id: shop?.id,
        type: "production",
      };
      setPayload(payload);
    }
  }, [filters, shop]);

  useEffect(() => {
    setSelected("overall");
  }, [kpi]);

  const fetchData = (payload) => {
    setLoading(true);
    fetchReportGraph(payload)
      .then((res) => {
        var data = _.get(res, ["data"], []);
        setData(data);
        setLoading(false);
      })
      .catch((ex) => {
        setData([]);
        setSingleGraphData([]);
        setLoading(false);
        const params = {
          open: true,
          message: "Error fetching data",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const handleChange = (val) => {
    setSelected(val);
  };

  const handleBarClick = (payload) => {
    setSingle(payload);
    const date = payload?.name;
    const machine = payload?.bar;
    const data2 = data[1];
    const res = data2[date][machine];
    const formattedRes = productionSingleMapper(res, kpi);
    setSingleGraphData(formattedRes);
    setSelected("single");
    console.log("handleBarClick", res, date);
  };

  const handleMachineBarClick = (payload) => {
    setSingle(payload);
    const date = payload?.name;
    const machine = payload?.bar;
    const group = payload[payload?.bar + " group"];
    const data2 = data[1];
    const res = data2[date][group][machine];
    console.log("handleMachineBarClick", res);
    const formattedRes = productionSingleMachineMapper(res, machine, kpi);
    setSingleGraphData(formattedRes);
    setSelected("single");
  };

  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Box className={classes["container-flex"]}>
        <Box className={classes["container-flex"]} sx={{ pl: 1.2 }}>
          <Typography
            variant="h4"
            sx={{
              color: TypeSecondary,
              fontWeight: selected === "single" ? 400 : 600,
            }}
          >
            Machine Status{" "}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: TypeSecondary,
              visibility: selected === "single" ? "visible" : "hidden",
            }}
          >
            {`>  ${single?.bar}`}
          </Typography>
        </Box>
        {selected === "single" ? (
          <Box
            className={classes["container-flex"]}
            sx={{
              cursor: "pointer",
              visibility: selected === "single" ? "visible" : "hidden",
            }}
            onClick={() => handleChange("overall")}
          >
            <img
              alt=""
              src={BackIcon}
              style={{ height: "1.6rem", width: "1.6rem" }}
            />
            <Typography variant="body1" sx={{ color: MarutiBlue500 }}>
              Back
            </Typography>
          </Box>
        ) : (
          <CustomSwitch
            leftLabel="Machine Groups"
            rightLabel="Machine Wise"
            checked={checked}
            handleChange={handleCheckChange}
          />
        )}
      </Box>
      {selected === "single" ? (
        <SingleMachine
          date={single?.name}
          data={singleGraphData}
          shift={filters?.shift}
        />
      ) : !checked ? (
        <MachineGroup
          loading={loading}
          data={data}
          kpi={kpi}
          onBarClick={handleBarClick}
        />
      ) : (
        <Machines
          loading={loading}
          data={data}
          kpi={kpi}
          onBarClick={handleMachineBarClick}
        />
      )}
    </Box>
  );
});

export default Production;
