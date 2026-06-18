import { Box, Switch, Typography } from "@mui/material";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProdigiContext } from "../../../../App";
import DownloadIcon from "../../../../assets/icons/DownloadReport.svg";
import RefreshIcon from "../../../../assets/icons/Refresh.svg";
import ArrowTooltip from "../../../../components/ArrowTooltip/ArrowTooltip";
import DownloadProgress from "../../../../components/DownloadProgress/DownloadProgress.component";
import MultiCheckboxSelect from "../../../../components/MultiSelect/MultiCheckboxSelect";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { downloadshopView } from "../../../../Repository/ShopViewRepository";
import { MarutiBlack, TypeTertiary } from "../../../../utils/colors";
import {
  eventReplica,
  listResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "./Filters.styles";
import { getDownloadShops } from "../../../../services/auth";

const Filters = ({
  filters = {},
  onRefresh = () => {},
  onChange = () => {},
  domain = {},
}) => {
  const shop = useSelector(getShop);
  const classes = useStyles();
  const [openDownload, setOpenDownload] = useState(false);
  const context = useContext(ProdigiContext);
  const downloadShops = getDownloadShops();

  const checkAccess = () => {
    if (downloadShops?.includes(String(shop?.id))) {
      return true;
    }
    return false;
  };

  const handleMultiClearAll = (name) => {
    onChange(eventReplica(name, []));
  };

  useEffect(() => {
    if (!_.isEmpty(shop)) {
      onChange(eventReplica("machines", []));
    }
  }, [shop]);

  const downloadReport = (options) => {
    const payload = {
      view: filters?.view ? "CURRENT" : "DAY",
      shop_id: shop?.id,
      machine_group: "",
      machine_name: listResult(filters?.machines), //
    };
    return downloadshopView(payload, options);
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

  return (
    <Box className={classes["shopView-right-info"]}>
      <Box className={classes["shopView-right-info"]} sx={{ mr: 1 }}>
        <Typography
          variant="body1"
          sx={{
            color: filters?.view ? TypeTertiary : MarutiBlack,
            MarutiBlack,
            lineHeight: "1.6rem",
          }}
        >
          Day View
        </Typography>
        <Box>
          <Switch
            checked={filters.view || false}
            name="view"
            size="small"
            className={classes["custom-switch"]}
            onChange={onChange}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: filters?.view ? MarutiBlack : TypeTertiary,
            letterSpacing: "-0.035rem",
          }}
        >
          Current View
        </Typography>
      </Box>
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
        </Box>
      </ArrowTooltip>
      <img
        onClick={onRefresh}
        src={RefreshIcon}
        alt=""
        style={{ height: "3.2rem", width: "3.2rem", cursor: "pointer" }}
      />
      {openDownload && (
        <DownloadProgress
          clickaway={false}
          open={openDownload}
          endpoint={downloadReport}
          downloadName={"ShopView_Report"}
          onClose={() => {
            setOpenDownload(false);
          }}
        />
      )}
    </Box>
  );
};

export default Filters;
