import _ from "lodash";
import { createSelector } from "reselect";

const selectProductionReducer = (state) => state.PressShopProductionReducer;

export const selectMachines = createSelector(
  [selectProductionReducer],
  (productionReducer) => {
    const machines = productionReducer?.machines;
    const groupedData = _.groupBy(machines, "machine_group");
    const result = _.map(groupedData, (group, groupName) => ({
      name: groupName,
      value: _.sortBy(
        group.map((item) => ({
          id: item.id,
          value: item.machine,
        })),
        "value"
      ),
    }));
    return result;
  }
);

export const selectShopMachines = createSelector(
  [selectProductionReducer],
  (productionReducer) => productionReducer?.machines
);
