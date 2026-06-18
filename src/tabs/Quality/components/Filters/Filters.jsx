import { Box, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../../../App";
import DownloadIcon from "../../../../assets/icons/DownloadReport.svg";
import RefreshIcon from "../../../../assets/icons/Refresh.svg";
import ArrowTooltip from "../../../../components/ArrowTooltip/ArrowTooltip";
import DownloadProgress from "../../../../components/DownloadProgress/DownloadProgress.component";
import MuiDateTimePicker from "../../../../components/MuiDateTimePicker/MuiDateTimePicker";
import MultiCheckboxSelect from "../../../../components/MultiSelect/MultiCheckboxSelect";
import MultiSelect from "../../../../components/MultiSelect/MultiSelect";
import Select from "../../../../components/Select/Select";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { downloadQuality } from "../../../../Repository/QualityRepository";
import {
  eventReplica,
  formatDateTime,
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Quality.styles";
import { getDownloadShops } from "../../../../services/auth";

const Filters = ({
  filters = {},
  onChange = () => {},
  handleClearAll = () => {},
  domain = {},
  onRefresh = () => {},
}) => {
  const classes = useStyles();
  const shop = useSelector(getShop);
  const dispatch = useDispatch();
  const [openDownload, setOpenDownload] = useState(false);
  const context = useContext(ProdigiContext);
  const downloadShops = getDownloadShops();

  const checkAccess = () => {
    if (downloadShops?.includes(String(shop?.id))) {
      return true;
    }
    return false;
  };

  const handleToggle = (groupOptions, label) => () => {
    const value = filters[label];
    let newSelectedOptions = [...value];
    if (Array.isArray(groupOptions)) {
      const someOptionsNotSelected = groupOptions.some(
        (option) => !newSelectedOptions.includes(option)
      );
      if (someOptionsNotSelected) {
        groupOptions.forEach((option) => {
          if (!newSelectedOptions.includes(option)) {
            newSelectedOptions.push(option);
          }
        });
      } else {
        groupOptions.forEach((option) => {
          const index = newSelectedOptions.indexOf(option);
          if (index !== -1) {
            newSelectedOptions.splice(index, 1);
          }
        });
      }
      onChange(eventReplica(label, newSelectedOptions));
    } else {
      if (groupOptions === "All") {
        if (label === "machines") {
          if (newSelectedOptions.length === domain[label]?.length) {
            onChange(eventReplica(label, []));
          } else {
            onChange(eventReplica(label, [...domain[label]]));
          }
        } else {
          if (newSelectedOptions.length === domain[label]?.length) {
            onChange(eventReplica(label, []));
          } else {
            onChange(eventReplica(label, [...domain[label]]));
          }
        }
      } else {
        const currentIndex = newSelectedOptions.indexOf(groupOptions);
        if (currentIndex === -1) {
          newSelectedOptions.push(groupOptions);
        } else {
          newSelectedOptions.splice(currentIndex, 1);
          newSelectedOptions = newSelectedOptions.filter(
            (item) => item !== "All"
          );
        }
        onChange(eventReplica(label, [...newSelectedOptions]));
      }
    }
  };

  const areAllGroupOptionsSelected = (groupOptions) =>
    groupOptions?.every((option) => filters?.machines?.includes(option));

  const handleMultiClearAll = (name) => {
    onChange(eventReplica(name, []));
  };

  const handleStartTime = (val) => {
    if (
      filters.start_time === "" ||
      (new Date(val) < new Date(filters?.end_time) &&
        new Date(val) < new Date())
    ) {
      onChange(eventReplica("start_time", val));
    } else {
      const params = {
        open: true,
        message: "Start time must be less than end time",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
    }
  };

  const handleEndTime = (val) => {
    if (
      new Date(val) > new Date(filters?.start_time) &&
      new Date(val) <= new Date()
    ) {
      onChange(eventReplica("end_time", val));
    } else if (new Date(val) > new Date()) {
      const params = {
        open: true,
        message: "End time must not be greater than current time",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
    } else {
      const params = {
        open: true,
        message: "End time must be greater than start time",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
    }
  };

  const downloadReport = (options) => {
    const payload = {
      machine_list: listResult(filters?.machines),
      model_list: listResult(filters?.models),
      part_name_list: listResult(filters?.part_names),
      start_time: formatDateTime(filters?.start_time, "YYYY-MM-DD HH:mm:ss"),
      end_time: formatDateTime(filters?.end_time, "YYYY-MM-DD HH:mm:ss"),
      batch: selectResult(filters?.batch_id),
      shift: selectResult(filters?.shift),
      shop_id: shop?.id,
    };
    if (filters?.tabValue !== "2") {
      payload.hold_qty = selectResult(filters?.hold_qty);
      payload.module = "quality";
    } else {
      payload.status = selectResult(filters?.status);
      payload.module = "rework";
    }
    return downloadQuality(payload, options);
  };

  return (
    <Box className={classes["filter-container-flex"]}>
      <Box className={classes["quality-filters"]}>
        <MultiCheckboxSelect
          label="Machine"
          name="machines"
          onChange={onChange}
          options={domain?.machines}
          handleClearAll={handleMultiClearAll}
          selectedOptions={filters?.machines}
          handleGroupToggle={(props) => handleToggle(props, "machines")}
          areAllGroupOptionsSelected={(item) =>
            areAllGroupOptionsSelected(item)
          }
        />
        <MultiSelect
          name="models"
          label="Model"
          onChange={onChange}
          handleClearAll={handleMultiClearAll}
          options={domain?.models}
          selectedOptions={filters?.models}
          handleToggle={(props) => handleToggle(props, "models")}
        />
        <MultiSelect
          name="part_names"
          label="Part Name"
          onChange={onChange}
          handleClearAll={handleMultiClearAll}
          options={domain?.part_names}
          selectedOptions={filters?.part_names}
          handleToggle={(props) => handleToggle(props, "part_names")}
        />
        <MuiDateTimePicker
          label="Start Time"
          value={filters?.start_time}
          onChange={handleStartTime}
        />
        <MuiDateTimePicker
          label="End Time"
          value={filters?.end_time}
          onChange={handleEndTime}
        />

        <Select
          name="batch_id"
          label="Batch Id"
          onChange={onChange}
          value={filters.batch_id}
          handleClearAll={handleClearAll}
        >
          {domain?.batch_id?.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>

        {filters?.tabValue == "2" && (
          <Select
            name="status"
            label="Status"
            onChange={onChange}
            value={filters.status}
            handleClearAll={handleClearAll}
          >
            {domain?.status?.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        )}
        <Select
          name="shift"
          label="Shift"
          onChange={onChange}
          value={filters.shift}
          handleClearAll={handleClearAll}
        >
          {domain?.shifts?.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {filters?.tabValue !== "2" && (
          <Select
            name="hold_qty"
            label="Hold Qty"
            onChange={onChange}
            value={filters?.hold_qty}
            handleClearAll={handleClearAll}
          >
            {domain?.hold_qty?.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>
      <Box
        className={classes["container-flex"]}
        sx={{ gap: "0.8rem !important" }}
      >
        <ArrowTooltip
          show={!checkAccess()}
          message="You don't have download access for this shop"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={DownloadIcon}
              onClick={() => setOpenDownload(true)}
              alt=""
              style={{
                height: "3.2rem",
                width: "3.2rem",
                cursor: "pointer",
                opacity: !checkAccess() ? "0.5" : "1",
                pointerEvents: !checkAccess() ? "none" : "inherit",
              }}
            />
            {openDownload && (
              <DownloadProgress
                clickaway={false}
                open={openDownload}
                endpoint={downloadReport}
                downloadName={"Quality_Report"}
                onClose={() => {
                  setOpenDownload(false);
                }}
              />
            )}
          </Box>
        </ArrowTooltip>
        <img
          onClick={onRefresh}
          src={RefreshIcon}
          alt=""
          style={{ height: "3.2rem", width: "3.2rem", cursor: "pointer" }}
        />
      </Box>
    </Box>
  );
};
export default Filters;
