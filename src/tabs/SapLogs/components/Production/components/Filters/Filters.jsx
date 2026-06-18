import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import MuiDateTimePicker from "../../../../../../components/MuiDateTimePicker/MuiDateTimePicker";
import MultiSelect from "../../../../../../components/MultiSelect/MultiSelect";
import { setApplicationAlert } from "../../../../../../redux/Actions/AlertActions";
import { eventReplica } from "../../../../../../utils/helperFunctions.utils";
import MultiSelectFilter from "../../../../../../components/MultiSelect/MultiSelectFilter";
import MultiCheckboxSelect from "../../../../../../components/MultiSelect/MultiCheckboxSelect";

const Filters = ({ filters = {}, onChange = () => {}, domain = {} }) => {
  const dispatch = useDispatch();

  const areAllGroupOptionsSelected = (groupOptions) =>
    groupOptions?.every((option) => filters?.machines?.includes(option));

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
        </Box>
        <Box>
          <MultiSelectFilter
            disabled={false}
            values={[...new Set(filters?.program_no)]}
            onChange={(props) => onChange(eventReplica("program_no", props))}
            options={domain?.program_no}
            selectLabel={"All"}
            label="Program No."
          />
        </Box>
        <Box>
          <MultiSelectFilter
            disabled={false}
            values={filters?.program_name}
            onChange={(props) => onChange(eventReplica("program_name", props))}
            options={domain?.program_name}
            selectLabel={"All"}
            label="Program Name"
          />
        </Box>
        <Box>
          <MultiSelectFilter
            disabled={false}
            values={filters?.models}
            onChange={(props) => onChange(eventReplica("models", props))}
            options={domain?.models}
            selectLabel={"All"}
            label="Model"
          />
        </Box>
        <MultiSelect
          name="shifts"
          label="Shift"
          onChange={onChange}
          handleClearAll={handleMultiClearAll}
          options={domain?.shifts}
          selectedOptions={filters?.shifts}
          handleToggle={(props) => handleToggle(props, "shifts")}
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
        <MultiSelect
          name="status"
          label="Status"
          onChange={onChange}
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
