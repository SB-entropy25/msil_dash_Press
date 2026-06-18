import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import MuiDateTimePicker from "../../../../../../components/MuiDateTimePicker/MuiDateTimePicker";
import { setApplicationAlert } from "../../../../../../redux/Actions/AlertActions";
import { eventReplica } from "../../../../../../utils/helperFunctions.utils";
import MultiSelect from "../../../../../../components/MultiSelect/MultiSelect";
import MultiSelectFilter from "../../../../../../components/MultiSelect/MultiSelectFilter";

const Filters = ({ filters = {}, onChange = () => {}, domain = {} }) => {
  const dispatch = useDispatch();

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

  const getPreviousDate = (previousDay = 7) => {
    const today = new Date();
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - previousDay);
    return previousDate;
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
        if (newSelectedOptions.length === domain[label]?.length) {
          onChange(eventReplica(label, []));
        } else {
          onChange(eventReplica(label, [...domain[label]]));
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

  const handleMultiClearAll = (name) => {
    onChange(eventReplica(name, []));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        gap: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <MultiSelectFilter
            disabled={false}
            values={filters?.header_material}
            onChange={(props) =>
              onChange(eventReplica("header_material", props))
            }
            options={domain?.header_material}
            selectLabel={"All"}
            label="Header material"
          />
        </Box>
        <Box>
          <MultiSelectFilter
            disabled={false}
            values={filters?.work_center}
            onChange={(props) => onChange(eventReplica("work_center", props))}
            options={domain?.work_center}
            selectLabel={"All"}
            label="Work center"
          />
        </Box>
        <MuiDateTimePicker
          label="Start Time"
          value={filters?.start_time}
          minDate={getPreviousDate()}
          onChange={handleStartTime}
        />
        <MuiDateTimePicker
          label="End Time"
          value={filters?.end_time}
          onChange={handleEndTime}
        />
        <MultiSelect
          name="reasons"
          label="Reason"
          handleClearAll={handleMultiClearAll}
          options={domain?.reasons}
          selectedOptions={filters?.reasons}
          handleToggle={(props) => handleToggle(props, "reasons")}
        />
        <MultiSelect
          name="remarks"
          label="Remarks"
          handleClearAll={handleMultiClearAll}
          options={domain?.remarks}
          selectedOptions={filters?.remarks}
          handleToggle={(props) => handleToggle(props, "remarks")}
        />
        <MultiSelect
          name="shifts"
          label="Shift"
          handleClearAll={handleMultiClearAll}
          options={domain?.shifts}
          selectedOptions={filters?.shifts}
          handleToggle={(props) => handleToggle(props, "shifts")}
        />
        <MultiSelect
          name="status"
          label="Status"
          handleClearAll={handleMultiClearAll}
          options={domain?.status}
          selectedOptions={filters?.status}
          handleToggle={(props) => handleToggle(props, "status")}
        />
      </Box>
    </Box>
  );
};
export default Filters;
