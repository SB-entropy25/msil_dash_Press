import { Box, Divider, Paper } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertIcon from "../../assets/icons/alert.svg";
import RefreshIcon from "../../assets/icons/Refresh.svg";
import AreYouSure from "../../components/AreYouSure/AreYouSure";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton/SecondaryButton";
import GroupedSelect from "../../components/Select/GroupedSelect";
import { setApplicationAlert } from "../../redux/Actions/AlertActions";
import { fetchStopTime } from "../../redux/Actions/DowntimeActions";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { selectMachines } from "../../redux/Selectors/ProductionSelector";
import { fetchDowntimeStopTime } from "../../Repository/DowntimeRepository";
import {
  changeVariant,
  fetchProduction,
  fetchProductionParts,
  pauseProduction,
} from "../../Repository/ProductionRepository";
import {
  checkValidList,
  formatDateTime,
  getStartDate,
  listResult,
  selectResult,
} from "../../utils/helperFunctions.utils";
import ContentBox from "./components/ContentBox/ContentBox";
import Dashboard from "./components/Dashboard/Dashboard";
import DowntimePunching from "./components/DowntimePunching/DowntimePunching";
import Initiation from "./components/Initiation/Initiation";
import InputMaterial from "./components/InputMaterial/InputMaterial";
import PartSelection from "./components/PartSelection/PartSelection";
import useStyles from "./Production.styles";

const Production = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [parts, setParts] = useState([]);
  const [screen, setScreen] = useState(1);
  const [machine, setMachine] = useState({ id: "", value: "" });
  const [openSelection, setOpenSelection] = useState(false);
  const [openMaterial, setOpenMaterial] = useState(false);
  const [openProductionMaterial, setOpenProductionMaterial] = useState(false);
  const [production, setProduction] = useState({});
  const [payload, setPayload] = useState({});
  const [productionPayload, setProductionPayload] = useState({});
  const [partDetails, setPartDetails] = useState([]);
  const [openPause, setOpenPause] = useState(false);
  const [openDowntime, setOpenDowntime] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState({
    overall: false,
    pause: false,
    part1: false,
    part2: false,
  });
  const [stopTime, setStopTime] = useState(0);

  const shop = useSelector(getShop);
  const machines = useSelector(selectMachines);
  //  common code

  const handleClearAll = () => {
    setMachine({ id: "", value: "" });
    setParts([]);
    setScreen(1);
    setPayload({});
    setPartDetails([]);
    setProduction({});
  };

  const handleMachineChange = (val) => {
    setParts([]);
    setMachine(val);
    setScreen(1);
    setPayload({});
    setPartDetails([]);
    setProduction({});
  };

  // useEffect(() => {
  //   console.log("PARTS", parts);
  // }, [parts]);

  const fetchCurrentProduction = (payload) => {
    setLoading({ ...loading, overall: true, part1: true, part2: true });
    setProduction({});
    setPartDetails([]);
    setStopTime(0);
    fetchProduction(payload)
      .then((res) => {
        const data = _.get(res, ["data"], {});
        setProduction(data);
        if (data?.status === null) {
          setScreen(1);
          setLoading({
            ...loading,
            overall: false,
            part1: false,
            part2: false,
          });
        } else {
          setScreen(2);
          const payload = {
            shop_id: shop?.id,
            production_id: data?.id,
          };
          setDisabled(true);
          setLoading({ ...loading, part1: true, part2: true });
          // fetchProductionData(payload, data);
          setProductionPayload(payload);
        }
      })
      .catch((ex) => {
        let message = "";
        if (ex?.response?.status === 409) {
          message = ex?.response?.data?.message;
        } else {
          message = ex?.message;
        }
        const params = {
          open: true,
          message: message,
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  useEffect(() => {
    if (!_.isEmpty(production) && !_.isEmpty(productionPayload)) {
      fetchProductionData(productionPayload, production);
    }
    const interval = setInterval(() => {
      if (!_.isEmpty(production) && !_.isEmpty(productionPayload)) {
        fetchProductionData(productionPayload, production);
      }
    }, 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [productionPayload]);

  useEffect(() => {
    setPartDetails([]);
    setProduction({});
    if (machine?.value !== "" && !_.isEmpty(shop) && shop?.id) {
      const payload = {
        shop_id: shop?.id,
        equipment_id: machine?.id,
      };
      fetchCurrentProduction(payload);
    }
  }, [machine]);

  useEffect(() => {
    setMachine({ id: "", value: "" });
    setParts([]);
    setScreen(1);
    setPayload({});
    setPartDetails([]);
    setProduction({});
  }, [shop]);

  //  initiation part

  const handleNext = () => {
    setOpenMaterial(true);
    setOpenSelection(false);
  };

  const handlePrevious = () => {
    setOpenSelection(true);
    setOpenMaterial(false);
  };

  const handleSelectionClose = () => {
    setOpenSelection(false);
    setParts([]);
  };

  const handleMaterialClose = () => {
    setOpenMaterial(false);
    // setParts([]);
  };

  const handleMaterialSubmit = () => {
    setOpenMaterial(false);
    setScreen(2);
    const payload = {
      shop_id: shop?.id,
      equipment_id: machine?.id,
    };
    fetchCurrentProduction(payload);
  };
  const handleMaterialUpdate = () => {
    setOpenProductionMaterial(false);
    const payload = {
      shop_id: shop?.id,
      equipment_id: machine?.id,
    };
    fetchCurrentProduction(payload);
  };
  //  dashboard part
  const fetchProductionData = (payload, prod) => {
    fetchProductionParts(payload)
      .then((res) => {
        const data = _.get(res, ["data"], {});
        setDisabled(false);
        setPartDetails(data?.parts);
        const parts = data?.parts;
        const load = { ...loading, overall: false, part1: false, part2: false };
        setLoading({ ...load });
        const payload = {
          shop_id: shop?.id,
          machine_list: listResult([machine?.value]),
          start_time: formatDateTime(
            getStartDate(prod?.date),
            "YYYY-MM-DD HH:mm:ss"
          ),
          // shift: selectResult(prod?.shift),
        };
        setPayload(payload);
        dispatch(fetchStopTime(payload));
        const obj = {
          machine_list: listResult([machine?.value]),
          shop_id: shop?.id,
          start_time: formatDateTime(
            getStartDate(prod?.date),
            "YYYY-MM-DD HH:mm:ss"
          ),
          shift: selectResult(prod?.shift),
        };
        fetchShiftDowntime(obj);
      })
      .catch((ex) => {
        console.log("ERROR", ex);
      });
  };

  const fetchShiftDowntime = (payload) => {
    fetchDowntimeStopTime(payload)
      .then((res) => {
        // console.log("RESULT",res);
        const data = _.get(res, ["data"], "");
        setStopTime(data);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const handlePauseProduction = () => {
    const payload = {
      production_id: production?.id,
      shop_id: shop?.id,
    };
    setLoading({ ...loading, pause: true });
    pauseProduction(payload)
      .then((res) => {
        setLoading({ ...loading, pause: false });
        setOpenPause(false);
        const params = {
          open: true,
          message: "Production Paused",
          type: "ALERT",
        };
        dispatch(setApplicationAlert(params));
        setScreen(1);
        setMachine({ id: "", value: "" });
        setParts([]);
      })
      .catch((ex) => {
        let message = "";
        if (ex?.response?.status === 409) {
          message = ex?.response?.data?.message;
        } else {
          message = ex?.message;
        }
        const params = {
          open: true,
          message: message,
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        setLoading({ ...loading, pause: false });
      });
  };

  const handleVariantChange = (params) => {
    changeVariant(params)
      .then((res) => {
        const payload = {
          shop_id: shop?.id,
          equipment_id: machine?.id,
        };
        fetchCurrentProduction(payload);
      })
      .catch((ex) => {
        let message = "";
        if (ex?.response?.status === 409) {
          message = ex?.response?.data?.message;
        } else {
          message = ex?.message;
        }
        const params = {
          open: true,
          message: message,
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const handleRefresh = () => {
    setPartDetails([]);
    setProduction({});
    if (machine?.value !== "" && !_.isEmpty(shop) && shop?.id) {
      const payload = {
        shop_id: shop?.id,
        equipment_id: machine?.id,
      };
      fetchCurrentProduction(payload);
    }
  };

  return (
    <Paper
      className="prodigi-paper"
      sx={{
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Box className={classes["container-flex"]}>
        <Box className={classes["container-flex-start"]} sx={{ gap: "0.8rem" }}>
          <GroupedSelect
            sx={{ width: "18rem !important" }}
            label="Select Machine"
            value={machine}
            options={machines}
            onChange={handleMachineChange}
            handleClearAll={handleClearAll}
          />
          {screen === 2 && (
            <ContentBox
              type="PRIMARY"
              label="Production Date"
              value={
                production?.date
                  ? formatDateTime(production?.date, "DD-MM-YYYY")
                  : "XX-XX-XXXX"
              }
            />
          )}
          {screen === 2 && (
            <ContentBox
              type="PRIMARY"
              label="Shift"
              value={production?.shift || "-"}
            />
          )}
          {screen === 2 && (
            <ContentBox
              type="PRIMARY"
              label="Shift Downtime"
              value={(stopTime || 0) + " Minutes"}
            />
          )}
        </Box>
        {screen === 1 && (
          <PrimaryButton
            color="Green"
            sx={{ width: "fit-content !important" }}
            onClick={() => setOpenSelection(true)}
            disabled={_.isEmpty(production)}
          >
            Initiate Production
          </PrimaryButton>
        )}
        {screen === 2 && (
          <Box
            className={classes["container-flex-start"]}
            sx={{ gap: "0.8rem" }}
          >
            <SecondaryButton
              sx={{ width: "fit-content !important" }}
              onClick={() => setOpenDowntime(true)}
              disabled={disabled}
            >
              Downtime Punching
            </SecondaryButton>
            <SecondaryButton
              sx={{ width: "fit-content !important" }}
              onClick={() => setOpenProductionMaterial(true)}
              disabled={
                disabled ||
                partDetails[0]?.batch_list[0]?.input_details ||
                partDetails?.[0]?.batch_list?.[0]?.prod_qty <= 0
              }
            >
              Input Material Update
              <img
                src={AlertIcon}
                alt=""
                style={{
                  height: "1.6rem",
                  width: "1.6rem",
                  marginLeft: "0.8rem",
                  display:
                    partDetails[0]?.batch_list[0]?.input_details === null
                      ? "inherit"
                      : "none",
                }}
              />
            </SecondaryButton>
            <PrimaryButton
              color="Red"
              sx={{ width: "fit-content !important" }}
              onClick={() => setOpenPause(true)}
              disabled={disabled}
            >
              Pause Production
            </PrimaryButton>
            <img
              onClick={handleRefresh}
              src={RefreshIcon}
              alt=""
              style={{ height: "3.2rem", width: "3.2rem", cursor: "pointer" }}
            />
          </Box>
        )}
      </Box>
      <Divider sx={{ mt: 1.6, mb: 1.6 }} />
      {openSelection && (
        <PartSelection
          production={production}
          open={openSelection}
          onClose={handleSelectionClose}
          parts={parts}
          setParts={setParts}
          onNext={handleNext}
          machine={machine}
        />
      )}
      {openMaterial && (
        <InputMaterial
          production={production}
          parts={parts}
          open={openMaterial}
          partDetails={partDetails}
          onClose={handleMaterialClose}
          onPrevious={handlePrevious}
          onSubmit={handleMaterialSubmit}
          setParts={setParts}
          productionInitiated={false}
          machine={machine}
        />
      )}
      {openProductionMaterial && (
        <InputMaterial
          production={production}
          parts={checkValidList([
            partDetails[0]?.part_obj,
            partDetails[1]?.part_obj,
          ])}
          partDetails={partDetails}
          open={openProductionMaterial}
          onClose={() => setOpenProductionMaterial(false)}
          onSubmit={handleMaterialSubmit}
          productionInitiated={true}
          machine={machine}
          onUpdate={handleMaterialUpdate}
        />
      )}
      {openPause && (
        <AreYouSure
          open={openPause}
          onClose={() => setOpenPause(false)}
          loading={loading?.pause}
          onSubmit={handlePauseProduction}
          message={"Do you really want to pause production?"}
        />
      )}
      {openDowntime && (
        <DowntimePunching
          production={production}
          machine={machine}
          open={openDowntime}
          onClose={() => setOpenDowntime(false)}
          parts={partDetails}
          initialPayload={payload}
        />
      )}
      {screen === 1 ? (
        <Initiation loading={loading?.overall} />
      ) : (
        <Dashboard
          loading={loading}
          production={production}
          parts={partDetails}
          machine={machine}
          onVariantChange={handleVariantChange}
        />
      )}
    </Paper>
  );
};
export default Production;
