import { Box, MenuItem } from "@mui/material";
import { useState } from "react";
import MultiDatePicker from "../../../../components/MultiDatePicker/MultiDatePicker";
import MultiCheckboxSelect from "../../../../components/MultiSelect/MultiCheckboxSelect";
import MultiSelect from "../../../../components/MultiSelect/MultiSelect";
import Select from "../../../../components/Select/Select";
import { eventReplica } from "../../../../utils/helperFunctions.utils";
import { statusColor } from "../../../../utils/mapper";
import useStyles from "../../Plan.styles";
import PlanUpload from "../PlanUpload/PlanUpload";

const Filters = ({
  filters = {},
  onChange = () => {},
  handleClearAll = () => {},
  domain = {},
  sort = null,
  onRefresh = () => {},
}) => {
  const classes = useStyles();
  const [dates, setDates] = useState();

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

  const handleDatesChange = (val) => {
    setDates(val);
    const production_dates = val?.map((item) => item.format("MM-DD-YYYY"));
    onChange(eventReplica("production_dates", production_dates));
  };
  const handleClearAllDates = () => {
    setDates([]);
    onChange(eventReplica("production_dates", []));
  };
  return (
    <Box className={classes["container-flex-start"]}>
      <Box className={classes["plan-filters"]}>
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
        <MultiSelect
          label="PE Code"
          name="pe_codes"
          onChange={onChange}
          handleClearAll={handleMultiClearAll}
          options={domain?.pe_codes}
          selectedOptions={filters?.pe_codes}
          handleToggle={(props) => handleToggle(props, "pe_codes")}
        />
        <MultiDatePicker
          label="Production Date"
          value={dates}
          onChange={handleDatesChange}
          selectedCount={dates?.length}
          handleClearAll={handleClearAllDates}
        />
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
        <Select
          name="priority"
          label="Priority"
          onChange={onChange}
          value={filters.priority}
          handleClearAll={handleClearAll}
        >
          {domain?.priority?.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
        <Select
          name="status"
          label="Status"
          onChange={onChange}
          value={filters.status}
          handleClearAll={handleClearAll}
        >
          {domain?.status?.map((item, index) => (
            <MenuItem
              value={item}
              key={index}
              sx={{ color: `${statusColor[item]} !important` }}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <PlanUpload filters={filters} sort={sort} onRefresh={onRefresh} />
    </Box>
  );
};
export default Filters;
