import { Circle } from "@mui/icons-material";
import {
  Box,
  LinearProgress,
  linearProgressClasses,
  MenuItem,
  Table as MuiTable,
  Paper,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoPart from "../../../../assets/icons/no-data.svg";
import ArrowTooltip from "../../../../components/ArrowTooltip/ArrowTooltip";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton/PrimaryButton";
import Select from "../../../../components/Select/Select";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import {
  Grey20,
  Grey5,
  MarutiBlack,
  MarutiBlue500,
  TypeTertiary,
} from "../../../../utils/colors";
import {
  addOneMinute,
  formatDateTime,
  listResult,
  selectResult,
  sliceString,
  subtractOneMinute,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Production.styles";
import QualityPunching from "../QualityPunching/QualityPunching";
import ToggleSwitch from "../../../../components/ToggleSwitch";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: Grey20,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: MarutiBlue500,
  },
}));

const DashboardCard = ({
  card = {},
  production = {},
  loading = false,
  part = "",
  onVariantChange = () => {},
  machine = {},
  toggleSyncing = () => {},
}) => {
  const classes = useStyles();

  const [openPunching, setOpenPunching] = useState(false);
  const [variant, setVariant] = useState("");
  const [payload, setPayload] = useState({});

  const shop = useSelector(getShop);

  useEffect(() => {
    if (!_.isEmpty(card)) {
      const filtered = card?.variant_list?.filter(
        (x) => x.material_code === card?.part_obj?.material_code
      )[0];
      if (filtered && !_.isEmpty(filtered)) {
        setVariant(filtered?.name);
      }
    }
  }, [card]);

  const handlePunchingClose = () => {
    setPayload({});
    setOpenPunching(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setVariant(value);
    const filtered = card?.variant_list?.filter((x) => x.name === value)[0];
    const body = {
      production_id: production?.id,
      prev_material_code: card?.part_obj?.material_code,
      material_code: filtered?.material_code,
      part: part,
      shop_id: shop?.id,
    };
    onVariantChange(body);
  };

  const handleOpenPunching = (batch) => {
    const payload = {
      machine_list: listResult([machine?.value]),
      model_list: listResult([card?.model]),
      part_name_list: listResult([card?.part_obj?.part_name]),
      start_time: formatDateTime(
        subtractOneMinute(batch?.start_time),
        "YYYY-MM-DD HH:mm:ss"
      ),
      end_time: formatDateTime(
        addOneMinute(batch?.end_time),
        "YYYY-MM-DD HH:mm:ss"
      ),
      batch: selectResult(batch?.batch_id),
      shop_id: shop?.id,
      page_no: 1,
      page_size: 20,
    };
    setPayload(payload);
    console.log("PAYLOAD", payload);
    setOpenPunching(true);
  };

  return (
    <Paper
      className={classes["dashboard-card"]}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}
    >
      {loading ? (
        <Skeleton
          sx={{ height: "100%" }}
          variant="rectangular"
          animation="wave"
        />
      ) : !_.isEmpty(card) ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <Box className={classes["container-flex"]} sx={{ mb: "0.8rem" }}>
            <Box
              className={classes["container-flex"]}
              sx={{ gap: "2rem !important" }}
            >
              <Typography variant="body1" sx={{ color: MarutiBlack }}>
                Model: <strong>{card?.model}</strong>
              </Typography>
              <Typography variant="body1" sx={{ color: MarutiBlack }}>
                Part name: <strong>{card?.part_obj?.part_name}</strong>
              </Typography>
              <Typography variant="body1" sx={{ color: MarutiBlack }}>
                PE code: <strong>{card?.part_obj?.pe_code}</strong>
              </Typography>
              <Typography variant="body1" sx={{ color: MarutiBlack }}>
                Program No:
                <strong>
                  {card?.batch_list ? card?.batch_list[0]?.program_no : "-"}
                </strong>
              </Typography>
            </Box>
            <Select
              name="variant"
              label="Select Variant"
              onChange={handleChange}
              value={variant}
              isAll={false}
              disabled={card?.variant_list?.length === 0}
            >
              {card?.variant_list?.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className={classes["production-card"]}>
            <Box className={classes["container-flex"]}>
              <Box className={classes["container-flex"]}>
                <Typography variant="h4" sx={{ color: MarutiBlack }}>
                  {card?.actual || 0}
                </Typography>
                <Typography variant="h4" sx={{ color: TypeTertiary }}>
                  ({card?.batch_list ? card?.batch_list[0]?.prod_qty : 0})
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: MarutiBlack }}>
                {card?.plan || 0}
              </Typography>
            </Box>
            <Box className={classes["container-flex"]} sx={{ mt: "2rem" }}>
              <Typography
                variant="h4"
                sx={{ color: MarutiBlack, fontWeight: 400 }}
              >
                <Circle
                  sx={{ mr: "0.6rem", color: MarutiBlue500 }}
                  fontSize="small"
                />
                Actual Production Qty
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: MarutiBlack, fontWeight: 400 }}
              >
                Planned Qty
                <Circle sx={{ ml: "0.6rem", color: Grey5 }} fontSize="small" />
              </Typography>
            </Box>
            <BorderLinearProgress
              variant="determinate"
              value={
                card?.actual > card?.plan
                  ? 100
                  : (card?.actual / card?.plan) * 100
              }
              sx={{ mt: "1.6rem" }}
            />
            <Box className={classes["container-flex"]} sx={{ mt: "1.6rem" }}>
              <Box
                className={classes["container-flex"]}
                sx={{ gap: "2rem !important" }}
              >
                <Box className={classes["container-flex-column"]}>
                  <Typography variant="h4" sx={{ color: MarutiBlack }}>
                    {card?.hold || 0}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: MarutiBlack, fontWeight: 400 }}
                  >
                    Hold
                  </Typography>
                </Box>
                <Box className={classes["container-flex-column"]}>
                  <Typography variant="h4" sx={{ color: MarutiBlack }}>
                    {card?.reject || 0}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: MarutiBlack, fontWeight: 400 }}
                  >
                    Reject
                  </Typography>
                </Box>
                <Box className={classes["container-flex-column"]}>
                  <Typography variant="h4" sx={{ color: MarutiBlack }}>
                    {card?.rework || 0}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: MarutiBlack, fontWeight: 400 }}
                  >
                    Rework
                  </Typography>
                </Box>
                <Box className={classes["container-flex-column"]}>
                  <Typography variant="h4" sx={{ color: MarutiBlack }}>
                    {card?.SPM || 0}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: MarutiBlack, fontWeight: 400 }}
                  >
                    SPM
                  </Typography>
                </Box>
                <Box className={classes["container-flex-column"]}>
                  <Typography variant="h4" sx={{ color: MarutiBlack }}>
                    {card?.efficiency?.toFixed(2) || 0}%
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: MarutiBlack, fontWeight: 400 }}
                  >
                    EFF
                  </Typography>
                </Box>
              </Box>
              <PrimaryButton
                sx={{ width: "fit-content !important" }}
                onClick={() => handleOpenPunching(card?.batch_list[0])}
              >
                Quality Punching
              </PrimaryButton>
            </Box>
          </Box>
          <TableLayout
            loading={false}
            className={classes["prodigi-prod-table-dimensions"]}
          >
            <TableContainer className={classes["prodigi-prod-table"]}>
              <MuiTable stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Batch ID</TableCell>
                    <TableCell align="left">I/P Material Handling ID</TableCell>
                    <TableCell align="left">O/P Material Handling ID</TableCell>
                    <TableCell align="left">Start Time</TableCell>
                    <TableCell align="left">End Time</TableCell>
                    <TableCell align="left">Actual Production Qty</TableCell>
                    <TableCell align="left">Reject/Rework</TableCell>
                    <TableCell align="left">SPM</TableCell>
                    <TableCell align="left">EFF</TableCell>
                    <TableCell align="left">Sap Syncing</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes["prodigi-table-body"]}>
                  {card?.batch_list?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        align="left"
                        sx={{ color: MarutiBlue500, cursor: "pointer" }}
                        onClick={() => handleOpenPunching(item)}
                      >
                        <ArrowTooltip message={item?.batch_id} show={true}>
                          {sliceString(item?.batch_id, 8)}
                        </ArrowTooltip>
                      </TableCell>
                      <TableCell align="left">{item?.input_details}</TableCell>
                      <TableCell align="left">{item?.output_details}</TableCell>
                      <TableCell align="left">
                        {formatDateTime(
                          item?.start_time,
                          "DD-MM-YYYY | hh:mm:ss A"
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {formatDateTime(
                          item?.end_time,
                          "DD-MM-YYYY | hh:mm:ss A"
                        )}
                      </TableCell>
                      <TableCell align="left">{item?.prod_qty || 0}</TableCell>
                      <TableCell align="left">
                        {item?.reject_qty || 0}/{item?.rework_qty || 0}
                      </TableCell>
                      <TableCell align="left">{item?.SPM || 0}</TableCell>
                      <TableCell align="left">
                        {item?.efficiency?.toFixed(2) || 0}%
                      </TableCell>
                      <TableCell align="center">
                        {!item?.end_time ? (
                          <ToggleSwitch
                            checked={item?.is_sap_call_enabled}
                            inputProps={{ "aria-label": "controlled" }}
                            onChange={() =>
                              toggleSyncing(
                                item?.batch_id,
                                !item?.is_sap_call_enabled
                              )
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </TableLayout>
          {openPunching && (
            <QualityPunching
              disableSubmit={payload?.end_time !== undefined}
              open={openPunching}
              row={production}
              card={card}
              initialPayload={payload}
              onClose={handlePunchingClose}
            />
          )}
        </Box>
      ) : (
        <Box className={classes["dashboard-card-no-part"]}>
          <img
            src={NoPart}
            alt=""
            style={{ height: "4.8rem", width: "4.8rem" }}
          />
          <Typography
            variant="body4"
            sx={{ color: MarutiBlack, fontWeight: 400, marginTop: "2rem" }}
          >
            Currently a single part is being produced
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
export default DashboardCard;
