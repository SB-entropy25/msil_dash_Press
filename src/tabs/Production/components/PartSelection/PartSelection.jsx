import {
  Box,
  DialogContent,
  Divider,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonContainer from "../../../../components/ButtonContainer/ButtonContainer";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton/PrimaryButton";
import DialogCard from "../../../../components/DialogCard/DialogCard.component";
import Loader from "../../../../components/Loader/Loader";
import Searchbox from "../../../../components/Searchbox/Searchbox";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { getPlan } from "../../../../Repository/PlanRepository";
import {
  MarutiBlack,
  MarutiBlue500,
  TypeSecondary,
} from "../../../../utils/colors";
import {
  formatDateTime,
  listResult,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Production.styles";
import ContentBox from "../ContentBox/ContentBox";
import TableData from "./TableData";

const columnWidth = {
  model: "6%",
  part_name: "14%",
  part_no: "14%",
  planned_qty: "16%",
  actual_qty: "16%",
  priority: "14%",
  check: "8%",
};
const PartSelection = ({
  open,
  onClose = () => {},
  clickaway = false,
  parts = [],
  setParts = () => {},
  onNext = () => {},
  production = {},
  machine = {},
}) => {
  const [value, setValue] = useState("");
  const [endMessage, setEndMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [end, setEnd] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState({});

  const shop = useSelector(getShop);
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let value = e.target.value.toLowerCase();
    setValue(value);
    value = value?.trim();
    let list = data;
    if (value !== "" && list?.length !== 0) {
      const filtered = list?.filter(
        (x) =>
          String(x.model).toLowerCase().includes(value) ||
          String(x.work_order_no).toLowerCase().includes(value) ||
          String(x.material_code).toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(list);
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      setFilteredData(data);
    }
  }, [data]);

  const handleItemChange = (value, item) => {
    if (value) {
      if (parts.length < 2) {
        setParts([...parts, item]);
      }
    } else {
      setParts([
        ...parts?.filter((obj) => obj.material_code !== item.material_code),
      ]);
    }
  };

  const handleClose = (item) => {
    setParts([
      ...parts?.filter((obj) => obj.material_code !== item.material_code),
    ]);
  };

  useEffect(() => {
    if (!_.isEmpty(production) && !_.isEmpty(shop) && !_.isEmpty(machine)) {
      const payload = {
        shop_id: shop?.id,
        machine_list: listResult([machine?.value]),
        production_date_list: listResult([
          formatDateTime(production?.date, "MM-DD-YYYY"),
        ]),
      };
      setPayload(payload);
    }
  }, [production, shop, machine]);

  useEffect(() => {
    if (payload && !_.isEmpty(payload)) {
      fetchData(payload, 1);
    }
  }, [payload]);

  const fetchData = (payload, pg_no) => {
    var params = payload;
    params.page_no = pg_no;
    params.page_size = 20;
    params.initiate_production = "true";
    getPlan(params)
      .then((res) => {
        var list = _.get(res, ["data"], []);
        if (list.length === 0) {
          setEnd(true);
          if (pg_no === 1) {
            setEndMessage("Records not available");
          } else {
            setEndMessage("No more records");
          }
        } else {
          if (pg_no > 1) {
            let res = [...data, ...list];
            setData(res);
          } else {
            setData(list);
          }
          setEnd(false);
          setEndMessage("");
        }
        setLoader(false);
      })
      .catch((ex) => {
        const params = {
          open: true,
          message: "Error loading data",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const loadMoreHandle = (event) => {
    if (!loader) {
      let bottom =
        event.target.offsetHeight + event.target.scrollTop >
        event.target.scrollHeight;
      if (bottom && !end) {
        let pg = page + 1;
        setLoader(true);
        fetchData(payload, pg);
        setPage(pg);
      }
    }
  };

  const classes = useStyles();
  return (
    <DialogCard
      clickaway={clickaway}
      open={open}
      handleClose={onClose}
      maxWidth={"md"}
      fullWidth={true}
      title={"Part Selection"}
      sx={{ color: TypeSecondary }}
      closable={true}
    >
      <DialogContent>
        <Divider sx={{ mb: "1.2rem" }} />
        <Box className={classes["container-flex-start"]}>
          <ContentBox
            type="PRIMARY"
            label="Production Date"
            value={formatDateTime(production?.date, "DD-MM-YYYY")}
          />
          <ContentBox type="PRIMARY" label="Shift" value={production?.shift} />
        </Box>
        <Divider sx={{ mb: "1.2rem", mt: "1.2rem" }} />
        <Box className={classes["container-flex"]}>
          <Searchbox
            value={value}
            onChange={handleChange}
            placeholder="Search by using Order no, model, part no."
          />
          <Box className={classes["container-flex-start"]}>
            <ContentBox
              type="SECONDARY"
              placeholder="Part Name 1"
              value={parts[0]?.part_name}
              part={parts[0]}
              onClose={handleClose}
            />
            <ContentBox
              type="SECONDARY"
              placeholder="Part Name 2"
              value={parts[1]?.part_name}
              part={parts[1]}
              onClose={handleClose}
            />
          </Box>
        </Box>
        <Divider sx={{ mb: "1.2rem", mt: "1.6rem" }} />
        <TableLayout
          loading={false}
          className={classes["prodigi-dialog-table-dimensions"]}
        >
          <TableContainer
            onScroll={loadMoreHandle}
            className={`${classes["prodigi-dialog-table"]} prodigi-dialog-table`}
          >
            <MuiTable stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: columnWidth.model }}>
                    Model
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: columnWidth.part_name }}
                  >
                    Part Name
                  </TableCell>
                  <TableCell align="center" sx={{ width: columnWidth.part_no }}>
                    Part No.
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: columnWidth.planned_qty }}
                  >
                    Planned Quantity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: columnWidth.actual_qty }}
                  >
                    Actual Quantity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: columnWidth.priority }}
                  >
                    Priority
                  </TableCell>
                  <TableCell align="center" sx={{ width: columnWidth.check }}>
                    Selection
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes["prodigi-table-body"]}>
                {filteredData?.map((item, index) => {
                  return (
                    <TableData
                      key={index}
                      index={index}
                      row={item}
                      columnWidth={columnWidth}
                      selected={_.some(parts, (object) =>
                        _.isEqual(object, item)
                      )}
                      onChange={handleItemChange}
                    />
                  );
                })}
              </TableBody>
            </MuiTable>
            {loader && (
              <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
                <Loader size="SMALL" />
              </Box>
            )}
            {end && !loader && (
              <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
                <Typography style={{ color: MarutiBlue500 }}>
                  {endMessage}
                </Typography>
              </Box>
            )}
          </TableContainer>
        </TableLayout>
        <Divider sx={{ mb: "1.2rem" }} />
        <ButtonContainer type="BETWEEN">
          <Typography variant="caption" sx={{ color: MarutiBlack }}>
            Please select Maximum 2 & Minimum 1 Model
          </Typography>
          <PrimaryButton
            sx={{ width: "11.6rem !important" }}
            disabled={parts?.length < 1}
            onClick={onNext}
          >
            Next
          </PrimaryButton>
        </ButtonContainer>
      </DialogContent>
    </DialogCard>
  );
};

export default PartSelection;
