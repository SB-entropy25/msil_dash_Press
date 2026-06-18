import { Box, Typography } from "@mui/material";
import _ from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../../../assets/icons/back.svg";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { fetchReportGraph } from "../../../../Repository/ReportsRepository";
import { MarutiBlue500, TypeSecondary } from "../../../../utils/colors";
import {
  formatDateTime,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Reports.styles";
import { downtimeMapper } from "../mappers";
import Overall from "./Overall";
import SingleMachine from "./SingleMachine";

const initialSingle = {
  name: "",
  shift: "",
  item: [],
};
const Downtime = forwardRef(({ filters = {} }, ref) => {
  const classes = useStyles();
  const [selected, setSelected] = useState("overall");
  const [single, setSingle] = useState(initialSingle);
  const [graphData, setGraphData] = useState([]);
  const [maximum, setMaximum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const shop = useSelector(getShop);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  const onRefresh = () => {
    if (payload && !_.isEmpty(payload)) {
      setSelected("overall");
      setGraphData([]);
      setMaximum(0);
      setLoading(true);
      fetchData(payload);
    }
  };

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload);
    }
  }, [payload]);

  const handleChange = (val) => {
    setSelected(val);
  };

  useEffect(() => {
    if (filters && !_.isEmpty(shop)) {
      setSelected("overall");
      setGraphData([]);
      setMaximum(0);
      setLoading(true);
      const payload = {
        machine_list: listResult(filters?.machines),
        model_list: listResult(filters?.models),
        part_name_list: listResult(filters?.part_names),
        start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD"),
        end_time: formatDateTime(filters?.end_time, "YYYY-MM-DD"),
        shift: selectResult(filters?.shift),
        shop_id: shop?.id,
        type: "downtime",
      };
      setPayload(payload);
    }
  }, [filters, shop]);

  const fetchData = (payload) => {
    setLoading(true);
    fetchReportGraph(payload)
      .then((res) => {
        var data = _.get(res, ["data"], []);
        const { list, max } = downtimeMapper(data);
        setGraphData(list);
        setMaximum(max);
        setLoading(false);
      })
      .catch((ex) => {
        setGraphData([]);
        setMaximum(0);
        setLoading(false);
        const params = {
          open: true,
          message: "Error fetching data",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const handleBarClick = (payload) => {
    const object = { ...payload, item: [payload.item] };
    setSingle(object);
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
            {"> Downtime"}{" "}
          </Typography>
        </Box>
        <Box
          className={classes["container-flex"]}
          sx={{
            cursor: "pointer",
            visibility: selected === "single" ? "visible" : "hidden",
          }}
          onClick={() => {
            handleChange("overall");
            setSingle(initialSingle);
          }}
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
      </Box>
      {selected === "single" ? (
        <SingleMachine
          shift={single?.shift || ""}
          graphData={single?.item}
          column={single?.name}
          max={maximum}
          reason={single?.reasons}
          selectedShift={filters?.shift}
        />
      ) : (
        <Overall
          filters={filters}
          graphData={graphData}
          onBarClick={handleBarClick}
          max={maximum}
          loading={loading}
        />
      )}
    </Box>
  );
});

export default Downtime;
