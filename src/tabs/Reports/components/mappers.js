import _ from "lodash";

export const qualityMapper = (data) => {
  const list = [];
  let max = 0;
  if (data && data?.length > 0) {
    data?.forEach((item, index) => {
      const object = {
        name: item?.machine_name,
        Aname: "Shift A",
        Avalue1: 0,
        Avalue2: 0,
        Avalue3: 0,
        Avalue4: 0,
        Avalue5: 0,
        Bname: "Shift B",
        Bvalue1: 0,
        Bvalue2: 0,
        Bvalue3: 0,
        Bvalue4: 0,
        Bvalue5: 0,
        Cname: "Shift C",
        Cvalue1: 0,
        Cvalue2: 0,
        Cvalue3: 0,
        Cvalue4: 0,
        Cvalue5: 0,
        Agap: 0,
        Bgap: 0,
        Cgap: 0,
      };
      if (item["Shift A"]) {
        object.Avalue1 = item["Shift A"]?.reject_qty;
        object.Avalue2 = item["Shift A"]?.pending_rework_qty;
        object.Avalue3 = item["Shift A"]?.recycle_qty;
        object.Avalue4 = item["Shift A"]?.hold_qty;
        object.Avalue5 = item["Shift A"]?.ok_qty;
      }
      if (item["Shift B"]) {
        object.Bvalue1 = item["Shift B"]?.reject_qty;
        object.Bvalue2 = item["Shift B"]?.pending_rework_qty;
        object.Bvalue3 = item["Shift B"]?.recycle_qty;
        object.Bvalue4 = item["Shift B"]?.hold_qty;
        object.Bvalue5 = item["Shift B"]?.ok_qty;
      }
      if (item["Shift C"]) {
        object.Cvalue1 = item["Shift C"]?.reject_qty;
        object.Cvalue2 = item["Shift C"]?.pending_rework_qty;
        object.Cvalue3 = item["Shift C"]?.recycle_qty;
        object.Cvalue4 = item["Shift C"]?.hold_qty;
        object.Cvalue5 = item["Shift C"]?.ok_qty;
      }
      const sumA =
        object?.Avalue1 +
        object?.Avalue2 +
        object?.Avalue3 +
        object?.Avalue4 +
        object?.Avalue5;

      const sumB =
        object?.Bvalue1 +
        object?.Bvalue2 +
        object?.Bvalue3 +
        object?.Bvalue4 +
        object?.Bvalue5;

      const sumC =
        object?.Cvalue1 +
        object?.Cvalue2 +
        object?.Cvalue3 +
        object?.Cvalue4 +
        object?.Cvalue5;
      if (sumA > max) {
        max = sumA;
      }
      if (sumB > max) {
        max = sumB;
      }
      if (sumC > max) {
        max = sumC;
      }
      object.reasonsA = item["Shift A"]?.reasons || [];
      object.reasonsB = item["Shift B"]?.reasons || [];
      object.reasonsC = item["Shift C"]?.reasons || [];
      list.push(object);
    });

    max = Math.ceil(max / 4) * 4;
    list.forEach((object, index) => {
      const sumA =
        object?.Avalue1 +
        object?.Avalue2 +
        object?.Avalue3 +
        object?.Avalue4 +
        object?.Avalue5;

      const sumB =
        object?.Bvalue1 +
        object?.Bvalue2 +
        object?.Bvalue3 +
        object?.Bvalue4 +
        object?.Bvalue5;

      const sumC =
        object?.Cvalue1 +
        object?.Cvalue2 +
        object?.Cvalue3 +
        object?.Cvalue4 +
        object?.Cvalue5;
      object.Agap = max - sumA;
      object.Bgap = max - sumB;
      object.Cgap = max - sumC;
    });
  }
  return { list, max };
};

export const qualityDonutMapper = (list) => {
  const changed = list?.map((x) => ({
    name: x?.reason,
    value: x?.count ? Number(x?.count) : 0,
  }));
  return changed;
};

export const checkDataValid = (list) => {
  let bool = list?.every((obj) => obj.count === 0);
  return bool;
};

export const downtimeMapper = (data) => {
  const list = [];
  let max = 0;
  if (data && data?.length > 0) {
    // console.log("DATA",data)
    data?.forEach((item, index) => {
      const object = {
        name: item?.machine_name,
        Aname: "Shift A",
        Avalue1: 0,
        Avalue2: 0,
        Avalue3: 0,
        Avalue4: 0,
        Bname: "Shift B",
        Bvalue1: 0,
        Bvalue2: 0,
        Bvalue3: 0,
        Bvalue4: 0,
        Cname: "Shift C",
        Cvalue1: 0,
        Cvalue2: 0,
        Cvalue3: 0,
        Cvalue4: 0,
        Agap: 0,
        Bgap: 0,
        Cgap: 0,
      };
      if (item["shift A"] && item["shift A"][0]) {
        object.Avalue1 = item["shift A"][0]?.breakdown_downtime;
        object.Avalue2 = item["shift A"][0]?.scheduled_downtime;
        object.Avalue3 = item["shift A"][0]?.idle_downtime;
        object.Avalue4 = item["shift A"][0]?.running_time;
      }
      if (item["shift B"] && item["shift B"][0]) {
        object.Bvalue1 = item["shift B"][0]?.breakdown_downtime;
        object.Bvalue2 = item["shift B"][0]?.scheduled_downtime;
        object.Bvalue3 = item["shift B"][0]?.idle_downtime;
        object.Bvalue4 = item["shift B"][0]?.running_time;
      }
      if (item["shift C"] && item["shift C"][0]) {
        object.Cvalue1 = item["shift C"][0]?.breakdown_downtime;
        object.Cvalue2 = item["shift C"][0]?.scheduled_downtime;
        object.Cvalue3 = item["shift C"][0]?.idle_downtime;
        object.Cvalue4 = item["shift C"][0]?.running_time;
      }
      // console.log("OBJECT",object)
      const sumA =
        object?.Avalue1 + object?.Avalue2 + object?.Avalue3 + object?.Avalue4;
      // console.log("SUM A",sumA)

      const sumB =
        object?.Bvalue1 + object?.Bvalue2 + object?.Bvalue3 + object?.Bvalue4;
      // console.log("SUM B",sumB)
      const sumC =
        object?.Cvalue1 + object?.Cvalue2 + object?.Cvalue3 + object?.Cvalue4;
      // console.log("SUM C",sumC)
      if (sumA > max) {
        max = sumA;
      }
      if (sumB > max) {
        max = sumB;
      }
      if (sumC > max) {
        max = sumC;
      }
      object.reasonsA = {
        breakdown_reasons: item["shift A"]
          ? item["shift A"][0]?.breakdown_reasons || []
          : [],
        idle_reasons: item["shift A"]
          ? item["shift A"][0]?.idle_reasons || []
          : [],
        scheduled_reasons: item["shift A"]
          ? item["shift A"][0]?.scheduled_reasons || []
          : [],
      };
      object.reasonsB = {
        breakdown_reasons: item["shift B"]
          ? item["shift B"][0]?.breakdown_reasons || []
          : [],
        idle_reasons: item["shift B"]
          ? item["shift B"][0]?.idle_reasons || []
          : [],
        scheduled_reasons: item["shift B"]
          ? item["shift B"][0]?.scheduled_reasons || []
          : [],
      };
      object.reasonsC = {
        breakdown_reasons: item["shift C"]
          ? item["shift C"][0]?.breakdown_reasons || []
          : [],
        idle_reasons: item["shift C"]
          ? item["shift C"][0]?.idle_reasons || []
          : [],
        scheduled_reasons: item["shift C"]
          ? item["shift C"][0]?.scheduled_reasons || []
          : [],
      };
      list.push(object);
    });
    // console.log("MAXX",max)
    max = Math.ceil(max / 4) * 4;
    // console.log(max)
    list.forEach((object, index) => {
      const sumA =
        object?.Avalue1 + object?.Avalue2 + object?.Avalue3 + object?.Avalue4;

      const sumB =
        object?.Bvalue1 + object?.Bvalue2 + object?.Bvalue3 + object?.Bvalue4;

      const sumC =
        object?.Cvalue1 + object?.Cvalue2 + object?.Cvalue3 + object?.Cvalue4;
      object.Agap = max - sumA;
      object.Bgap = max - sumB;
      object.Cgap = max - sumC;
    });
  }
  return { list, max };
};

export const downtimeDonutMapper = (list) => {
  const changed = list?.map((x) => ({
    name: x?.reason,
    value: x?.count ? Number(x?.count) : 0,
  }));
  return changed;
};

export const productionMapper = (data, kpi, colors) => {
  const list = [];
  let max = 0;

  let set = [];
  const groupSet = new Set();
  const distinct = new Set();
  if (data && !_.isEmpty(data)) {
    Object.keys(data)?.forEach((key, index) => {
      if (data[key] && !_.isEmpty(data[key])) {
        Object.keys(data[key])?.forEach((item, index) => {
          groupSet.add({ name: item });
          distinct.add(item);
        });
      }
    });
    const newMachineSet = [...groupSet]?.map((x) => ({
      name: x?.name,
      color: colors[[...distinct]?.indexOf(x?.name)],
    }));
    set = _.uniqBy([...newMachineSet], "name");
    Object.keys(data)?.forEach((key, index) => {
      const object = {
        name: key,
      };
      set?.forEach((item, i) => {
        object[item?.name] = 0;
        object[item?.name + " total"] = 0;
        object[item?.name + " label"] = item?.name;
      });
      if (data[key] && !_.isEmpty(data[key])) {
        Object.keys(data[key])?.forEach((item, index) => {
          object[item] = Number(data[key][item][kpiMapper[kpi]]?.toFixed(2));
          if (object[item] > max) {
            max = object[item];
          }
        });
      }
      list.push(object);
      max = Math.ceil(max / 4) * 4;
      list.forEach((object, index) => {
        set?.forEach((item, i) => {
          object[item?.name + " total"] = max - object[item?.name];
        });
      });
    });
  }
  return { list, set };
};

const kpiMapper = {
  Efficiency: "efficiency",
  SPH: "SPH",
  "Production Quantity": "prod_qty",
};
export const productionSingleMapper = (data, kpi) => {
  const list = [];
  let max = 0;
  if (data && !_.isEmpty(data)) {
    Object.keys(data)?.forEach((key, index) => {
      const object = {
        name: key,
        Aname: "Shift A",
        Avalue: 0,
        Bname: "Shift B",
        Bvalue: 0,
        Cname: "Shift C",
        Cvalue: 0,
        Agap: 0,
        Bgap: 0,
        Cgap: 0,
      };
      if (data[key]["A"]) {
        object.Avalue = data[key]["A"][kpiMapper[kpi]];
      }
      if (data[key]["B"]) {
        object.Bvalue = data[key]["B"][kpiMapper[kpi]];
      }
      if (data[key]["C"]) {
        object.Cvalue = data[key]["C"][kpiMapper[kpi]];
      }
      if (object.Avalue > max) {
        max = object.Avalue;
      }
      if (object.Bvalue > max) {
        max = object.Bvalue;
      }
      if (object.Cvalue > max) {
        max = object.Cvalue;
      }
      list.push(object);
    });

    max = Math.ceil(max / 4) * 4;
    list.forEach((object, index) => {
      object.Agap = max - object.Avalue;
      object.Bgap = max - object.Bvalue;
      object.Cgap = max - object.Cvalue;
    });
  }
  return list;
};

export const getColors = (list, desiredLength) => {
  const originalLength = list.length;

  if (desiredLength >= originalLength) {
    return list; // Return the original list if the desired length is greater or equal to the list's length.
  }

  const substring = [];
  if (desiredLength < 5) {
    for (let i = 5; i < originalLength; i = i + 3) {
      substring.push(list[i]);
    }
  } else if (desiredLength < 10) {
    for (let i = 1; i < originalLength; i = i + 2) {
      substring.push(list[i]);
    }
  } else {
    for (let i = 0; i < originalLength; i = i + 1) {
      substring.push(list[i]);
    }
  }
  return substring;
};

export const productionMachineMapper = (data, kpi, colors) => {
  const list = [];
  let max = 0;

  const set = new Set();
  const machinesSet = new Set();
  let machines = [];
  if (data && !_.isEmpty(data)) {
    Object.keys(data)?.forEach((key, index) => {
      if (data[key] && !_.isEmpty(data[key])) {
        Object.keys(data[key])?.forEach((group, ind) => {
          set.add(group);
          if (data[key][group] && !_.isEmpty(data[key][group])) {
            Object.keys(data[key][group])?.forEach((machine, i) => {
              machinesSet.add({ name: machine, group: group });
            });
          }
        });
      }
    });
    const newMachineSet = [...machinesSet]?.map((x) => ({
      name: x?.name,
      color: colors[[...set]?.indexOf(x?.group)],
    }));
    machines = _.uniqBy([...newMachineSet], "name");
    Object.keys(data)?.forEach((key, index) => {
      const object = {
        name: key,
      };
      machines?.forEach((item, i) => {
        object[item.name] = 0;
        object[item.name + " total"] = 0;
        object[item.name + " label"] = item.name;
        object[item.name + " group"] = "";
      });
      if (data[key] && !_.isEmpty(data[key])) {
        Object.keys(data[key])?.forEach((group, ind) => {
          if (data[key][group] && !_.isEmpty(data[key][group])) {
            Object.keys(data[key][group])?.forEach((machine, i) => {
              object[machine] = Number(
                data[key][group][machine][kpiMapper[kpi]]?.toFixed(2)
              );
              object[machine + " group"] = group;
              if (object[machine] > max) {
                max = object[machine];
              }
            });
          }
        });
      }
      list.push(object);
    });
    max = Math.ceil(max / 4) * 4;
    list.forEach((object, index) => {
      machines?.forEach((item, i) => {
        object[item.name + " total"] = max - object[item.name];
      });
    });
  }
  return { list, set, machines };
};

export const productionSingleMachineMapper = (data, machine, kpi) => {
  const list = [];
  let max = 0;
  if (data && !_.isEmpty(data)) {
    const object = {
      name: machine,
      Aname: "Shift A",
      Avalue: 0,
      Bname: "Shift B",
      Bvalue: 0,
      Cname: "Shift C",
      Cvalue: 0,
      Agap: 0,
      Bgap: 0,
      Cgap: 0,
    };
    if (data["A"]) {
      object.Avalue = data["A"][kpiMapper[kpi]];
    }
    if (data["B"]) {
      object.Bvalue = data["B"][kpiMapper[kpi]];
    }
    if (data["C"]) {
      object.Cvalue = data["C"][kpiMapper[kpi]];
    }
    if (object.Avalue > max) {
      max = object.Avalue;
    }
    if (object.Bvalue > max) {
      max = object.Bvalue;
    }
    if (object.Cvalue > max) {
      max = object.Cvalue;
    }
    list.push(object);

    max = Math.ceil(max / 4) * 4;
    list.forEach((object, index) => {
      object.Agap = max - object.Avalue;
      object.Bgap = max - object.Bvalue;
      object.Cgap = max - object.Cvalue;
    });
  }
  return list;
};
