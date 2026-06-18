import { Box, Card, Typography } from "@mui/material";
import _ from "lodash";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Critical from "../../../../assets/icons/Critical.svg";
import {
  setMachineList,
  setStatus,
} from "../../../../redux/ActionCreator/ShopViewActionCreator";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import {
  getShopViw,
  graphFetchAPI,
} from "../../../../Repository/ShopViewRepository";
import {
  Green,
  StatusRed,
  StatusYellow,
  Yellow2,
} from "../../../../utils/colors";
import { listResult } from "../../../../utils/helperFunctions.utils";
import Carousel from "../Carousel/Carousel.component";
import ChartContainer from "../ChartContainer/ChartContainer.component";
import Table from "../Table/Table.component";
import useStyles from "./MachineStatus.styles";

const MachineStatus = forwardRef(({ filters = {} }, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isChart, setChart] = useState(false);
  const [isChartData, setChartData] = useState({});
  const [endMessage, setEndMessage] = useState("");
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState({});
  const [graphData, setGraphData] = useState({});
  const [sltdGraphMachine, setSltdGraphMachine] = useState("");
  const shop = useSelector(getShop);
  const [loading, setLoading] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(true);

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  useEffect(() => {
    if (!_.isEmpty(shop)) {
      setChart(false);
    }
  }, [shop]);

  const onRefresh = () => {
    if (payload && !_.isEmpty(payload)) {
      setData([]);
      fetchData(payload, 1);
      if (isChart && !listResult(filters?.machines)) {
        const data = {
          machine_name: sltdGraphMachine,
          view: filters?.view ? "CURRENT" : "DAY",
          shop_id: payload?.shop_id,
        };
        fetchGraph(data);
        return;
      } else {
        setChart(false);
        setChartData({});
        setSltdGraphMachine("");
      }
    }
  };

  useEffect(() => {
    if (!_.isEmpty(filters) && !_.isEmpty(shop)) {
      const payload = {
        view: filters?.view ? "CURRENT" : "DAY",
        shop_id: shop?.id,
        machine_name: listResult(filters?.machines),
      };
      setPayload(payload);
      setChart(false);
    }
  }, [filters]);

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload, 1);
      if (isChart && !listResult(filters?.machines)) {
        const data = {
          machine_name: sltdGraphMachine,
          view: filters?.view ? "CURRENT" : "DAY",
          shop_id: payload?.shop_id,
        };
        fetchGraph(data);
        return;
      } else {
        setChart(false);
        setChartData({});
        setSltdGraphMachine("");
      }
    }
    return () => {};
  }, [payload]);

  const fetchGraph = async (data) => {
    setLoadingGraph(true);
    try {
      const res = await graphFetchAPI(data);
      let list = _.get(res, ["data"], {});
      setGraphData(list);
      setLoadingGraph(false);
    } catch (ex) {
      setLoadingGraph(false);
      const params = {
        open: true,
        message: "Error fetching graph data",
        type: "ERROR",
      };
      dispatch(setApplicationAlert(params));
    }
  };

  const handleTarget = (item) => {
    setChart(true);
    setChartData({ ...item });
    const data = {
      machine_name: item.machine_name,
      view: filters?.view ? "CURRENT" : "DAY",
      shop_id: shop?.id,
    };
    setSltdGraphMachine(item.machine_name);
    fetchGraph(data);
  };

  const handleClose = () => {
    setChart(false);
    setChartData({});
    setSltdGraphMachine("");
  };

  const fetchData = async (payload, pg_no) => {
    setLoading(true);
    var params = payload;
    params.page_no = pg_no;
    params.page_size = 20;
    try {
      const res = await getShopViw(params);
      let list = _.get(res, ["data"], {});
      setLoading(false);
      dispatch(setMachineList(data?.machine_list));
      if (list?.machine_list?.length === 0) {
        dispatch(setMachineList([]));
        dispatch(setStatus({ statu: list?.status, achieved: list?.achieved }));
        if (pg_no === 1) {
          setEndMessage("Records not available");
        } else {
          setEndMessage("No more records");
        }
        setData([]);
      } else {
        if (list?.machine_list?.length > 0) {
          dispatch(setMachineList(list?.machine_list));
        }
        dispatch(setStatus({ statu: list?.status, achieved: list?.achieved }));
        if (pg_no > 1) {
          let resp = [...data, ...list?.machine_list];
          setData(resp);
          if (isChart) {
            const sltdChart = resp.filter(
              (item) => item?.machine_name === sltdGraphMachine
            );
            sltdChart.length > 0 && setChartData({ ...sltdChart[0] });
            return;
          } else {
            setChartData({});
          }
        } else {
          setData([...list?.machine_list]);
          if (isChart) {
            const sltdChart = list?.machine_list?.filter(
              (item) => item.machine_name === sltdGraphMachine
            );
            console.log(sltdChart);
            sltdChart.length > 0 && setChartData({ ...sltdChart[0] });
            return;
          } else {
            setChartData({});
          }
        }
        setEndMessage("");
      }
    } catch (ex) {
      setLoading(false);
      const params = {
        open: true,
        message: "Error fetching data",
        type: "ERROR",
      };
      dispatch(setApplicationAlert(params));
    }
  };

  return (
    <Box className={classes["shopView-status"]} sx={{ flex: 1, mt: 1.6 }}>
      <Box
        flex={1.65}
        className={classes["shop-view-cards"]}
        sx={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            // height: "100%",
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box className={classes["machine-status"]}>
            <Typography variant="body4">Machine Status</Typography>
          </Box>
          <Box className={classes["container-status-flex"]}>
            <Box className={classes["shopView-running-status"]}>
              <Typography variant="body3" sx={{ fontWeight: 400 }}>
                Running
              </Typography>
              <Box
                className={classes["status-icon"]}
                sx={{ background: Green }}
              />
            </Box>
            <Box className={classes["shopView-running-status"]}>
              <Typography variant="body3" sx={{ fontWeight: 400 }}>
                Scheduled Stop
              </Typography>
              <Box
                className={classes["status-icon"]}
                sx={{ background: Yellow2 }}
              />
            </Box>

            <Box className={classes["shopView-running-status"]}>
              <Typography variant="body3" sx={{ fontWeight: 400 }}>
                Idle
              </Typography>
              <Box
                className={classes["status-icon"]}
                sx={{ background: StatusYellow }}
              />
            </Box>
            <Box className={classes["shopView-running-status"]}>
              <Typography variant="body3" sx={{ fontWeight: 400 }}>
                Breakdown
              </Typography>
              <Box
                className={classes["status-icon"]}
                sx={{ background: StatusRed }}
              />
            </Box>
            <Box className={classes["shopView-running-status"]}>
              <Typography variant="body3" sx={{ fontWeight: 400 }}>
                Critical
              </Typography>
              <Box>
                <img
                  src={Critical}
                  alt=""
                  style={{ height: "1.6rem", width: "1.6rem" }}
                />
              </Box>
            </Box>
          </Box>
          <Table data={data} endMessage={endMessage} loader={loading} />
        </Card>
      </Box>
      <Box
        className={classes["shop-view-cards"]}
        flex={1}
        sx={{ height: "100%" }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {!isChart && (
            <Carousel
              filters={filters}
              data={data}
              handleTarget={handleTarget}
            />
          )}
          {isChart && (
            <ChartContainer
              graphData={graphData}
              isChartData={isChartData}
              onClose={handleClose}
              loading={loadingGraph}
            />
          )}
        </Card>
      </Box>
    </Box>
  );
});

export default MachineStatus;
