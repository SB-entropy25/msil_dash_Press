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
import SecondaryButton from "../../../../components/Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../../../../components/DialogCard/DialogCard.component";
import Loader from "../../../../components/Loader/Loader";
import TableLayout from "../../../../components/TableLayout/TableLayout";
import TextInput from "../../../../components/TextField/TextField";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import {
  fetchInputs,
  submitProduction,
  updateInputMaterials,
} from "../../../../Repository/ProductionRepository";
import { Red, TypeSecondary } from "../../../../utils/colors";
import {
  equalList,
  formatDateTime,
  getError,
  handleNumberEmpty,
  isNonNegative,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Production.styles";
import ContentBox from "../ContentBox/ContentBox";

const columnWidth = {
  name: "20%",
  code: "16%",
  details: "16%",
  thickness: "16%",
  width: "16%",
  quantity: "16%",
};
const initialValue = {
  details: "",
  thickness: "",
  width: "",
  quantity: "",
};
const initialError = {
  details: "",
  thickness: false,
  width: false,
  quantity: false,
};

const InputMaterial = ({
  open,
  onClose,
  clickaway = false,
  parts = [],
  onPrevious = () => {},
  onSubmit = () => {},
  production = {},
  productionInitiated = false,
  setParts = () => {},
  partDetails = {},
  onUpdate = () => {},
  machine = {},
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [inputs, setInputs] = useState({});
  const [value1, setValue1] = useState(initialValue);
  const [value2, setValue2] = useState(initialValue);
  const [error1, setError1] = useState(initialError);
  const [error2, setError2] = useState(initialError);
  const [messages, setMessages] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [programData, setProgramData] = useState([]);

  const shop = useSelector(getShop);

  useEffect(() => {
    if (!_.isEmpty(shop) && parts && parts?.length > 0) {
      setLoading(true);
      const payload = {
        shop_id: shop?.id,
        parts: [],
        program_no: partDetails[0]?.batch_list[0]?.program_no,
        equipment_id: machine?.id,
      };
      if (parts[0]) {
        payload.parts[0] = parts[0]?.material_code;
      }
      if (parts[1]) {
        payload.parts[1] = parts[1]?.material_code;
      }
      fetchInputs(payload)
        .then((res) => {
          const data = _.get(res, ["data"], {});
          const arrProgram = _.get(res, ["data", "program_no"], []);
          setProgramData(arrProgram);
          if (equalList(Object.keys(data?.recipe), payload?.parts)) {
            setLoading(false);
            setInputs(data);
          } else {
            const params = {
              open: true,
              message: "Wrong Combination",
              type: "ALERT",
            };
            dispatch(setApplicationAlert(params));
            if (productionInitiated) {
              onClose();
            } else {
              onPrevious();
            }
          }
        })
        .catch((ex) => {
          setInputs({});
          setLoading(false);
          const params = {
            open: true,
            message: "No recipe present",
            type: "ERROR",
          };
          dispatch(setApplicationAlert(params));
        });
    }
  }, [parts, shop]);

  useEffect(() => {
    handleValidate();
  }, [value1, value2]);

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    const values = _.cloneDeep(value1);
    if (["quantity", "thickness", "width"].includes(name)) {
      if (isNonNegative(Number(value))) {
        values[name] = Number(value);
      }
    } else {
      values[name] = value;
    }
    setValue1(values);
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    const values = _.cloneDeep(value2);
    if (["quantity", "thickness", "width"].includes(name)) {
      if (isNonNegative(Number(value))) {
        values[name] = Number(value);
      }
    } else {
      values[name] = value;
    }
    setValue2(values);
  };

  const handleValidate = () => {
    let errors = _.cloneDeep(error1);
    const msgs = {};
    console.log(value1);
    if (inputs?.input_1) {
      Object.keys(value1).forEach((key, index) => {
        const name = key;
        const value = value1[key];
        const { msg, issues } = validateItem(
          inputs?.input_1,
          errors,
          name,
          value,
          "Part 1"
        );
        errors = { ...errors, ...issues };
        if (index !== 0) {
          msgs[index] = msg;
        }
      });
    }
    setError1({ ...errors });
    errors = _.cloneDeep(error2);
    if (inputs?.input_2) {
      Object.keys(value2).forEach((key, index) => {
        const name = key;
        const value = value2[key];
        const { msg, issues } = validateItem(
          inputs?.input_2,
          errors,
          name,
          value,
          "Part 2"
        );
        errors = { ...errors, ...issues };
        if (index !== 0) {
          msgs[index + 3] = msg;
        }
      });
    }
    setError2({ ...errors });
    setMessages(msgs);

    console.log(errors);
  };

  const validateItem = (input, errors, name, value, part) => {
    let validationMessage = "";
    let validationErrors = { ...errors };
    console.log(name);
    switch (name) {
      case "thickness": {
        let msg = "";
        const issues = { ...errors };
        if (input?.thickness_tolerance_unit === "ABSOLUTE") {
          if (value < input?.thickness_lower) {
            issues[name] = true;
            msg = `Material Thickness for ${part} is lesser than Specified Limit`;
          } else if (value > input?.thickness_upper) {
            issues[name] = true;
            msg = `Material Thickness for ${part} is greater than Specified Limit`;
          } else {
            issues[name] = false;
            msg = "";
          }
        } else if (input?.thickness_tolerance_unit === "RELATIVE") {
          if (value < input?.thickness_nominal - input?.thickness_lower) {
            issues[name] = true;
            msg = `Material Thickness for ${part} is lesser than Specified Limit`;
          } else if (
            value >
            input?.thickness_nominal + input?.thickness_upper
          ) {
            issues[name] = true;
            msg = `Material Thickness for ${part} is greater than Specified Limit`;
          } else {
            issues[name] = false;
            msg = "";
          }
        }
        if (value === "") {
          issues[name] = true;
          msg = `Material Thickness for ${part} is 0`;
        } else {
          issues[name] = false;
        }
        validationMessage = msg;
        validationErrors = { ...issues };
        break;
      }
      case "width": {
        let msg = "";
        const issues = { ...errors };
        if (input?.width_tolerance_unit === "ABSOLUTE") {
          if (value < input?.width_lower) {
            issues[name] = true;
            msg = `Material Width for ${part} is lesser than Specified Limit`;
          } else if (value > input?.width_upper) {
            issues[name] = true;
            msg = `Material Width for ${part} is greater than Specified Limit`;
          } else {
            issues[name] = false;
            msg = "";
          }
        } else if (input?.width_tolerance_unit === "RELATIVE") {
          if (value < input?.width_nominal - input?.width_lower) {
            issues[name] = true;
            msg = `Material Width for ${part} is lesser than Specified Limit`;
          } else if (value > input?.width_nominal + input?.width_upper) {
            issues[name] = true;
            msg = `Material Width for ${part} is greater than Specified Limit`;
          } else {
            issues[name] = false;
            msg = "";
          }
        }
        if (value === "") {
          issues[name] = true;
          msg = `Material Width for ${part} is 0`;
        } else {
          issues[name] = false;
        }
        validationMessage = msg;
        validationErrors = { ...issues };
        break;
      }
      case "quantity": {
        let msg = "";
        const issues = { ...errors };
        if (value === "") {
          issues[name] = true;
          msg = `Material Weight for ${part} is 0`;
        } else {
          issues[name] = false;
        }
        validationMessage = msg;
        validationErrors = { ...issues };
        break;
      }
      case "details": {
        let msg = "";
        const issues = { ...errors };
        if (value === "") {
          issues[name] = true;
          msg = `Material Details for ${part} is required`;
        } else {
          issues[name] = false;
        }
        validationMessage = msg;
        validationErrors = { ...issues };
        break;
      }
      default:
        break;
    }
    return { msg: validationMessage, issues: validationErrors };
  };

  const handleValidate1 = (e) => {
    const { name, value } = e.target;
    let errors = _.cloneDeep(error1);
    if (value.trim() === "") {
      errors[name] = true;
      if (name === "quantity") {
        const { msg, issues } = validateItem(
          inputs?.input_1,
          errors,
          name,
          value,
          "Part 1"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 3: msg });
      }
    } else {
      if (name === "thickness") {
        const { msg, issues } = validateItem(
          inputs?.input_1,
          errors,
          name,
          value,
          "Part 1"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 1: msg });
      }
      if (name === "width") {
        const { msg, issues } = validateItem(
          inputs?.input_1,
          errors,
          name,
          value,
          "Part 1"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 2: msg });
      }
      if (name === "quantity") {
        const { msg, issues } = validateItem(
          inputs?.input_1,
          errors,
          name,
          value,
          "Part 1"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 3: msg });
      }
    }
    setError1(errors);
  };

  const handleValidate2 = (e) => {
    const { name, value } = e.target;
    let errors = _.cloneDeep(error2);
    if (value.trim() === "") {
      errors[name] = true;
      if (name === "quantity") {
        const { msg, issues } = validateItem(
          inputs?.input_2,
          errors,
          name,
          value,
          "Part 2"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 6: msg });
      }
    } else {
      if (name === "thickness") {
        const { msg, issues } = validateItem(
          inputs?.input_2,
          errors,
          name,
          value,
          "Part 2"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 4: msg });
      }
      if (name === "width") {
        const { msg, issues } = validateItem(
          inputs?.input_2,
          errors,
          name,
          value,
          "Part 2"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 5: msg });
      }
      if (name === "quantity") {
        const { msg, issues } = validateItem(
          inputs?.input_2,
          errors,
          name,
          value,
          "Part 2"
        );
        errors = { ...errors, ...issues };
        setMessages({ ...messages, 6: msg });
      }
    }
    setError2(errors);
  };

  const handleFinish = () => {
    setInitiating(true);
    setLoading(true);
    const recipe = inputs?.recipe;
    const body = {
      input_materials: {},
      output_parts: Object.keys(recipe),
    };
    Object.keys(recipe)?.forEach((key, i) => {
      const list = [];
      recipe[key]?.forEach((part, ind) => {
        if (part === "input_1" && Object.keys(inputs)?.includes("input_1")) {
          const object = {
            name: inputs?.input_1?.material_code,
            material_details: value1?.details,
            thickness: handleNumberEmpty(value1?.thickness),
            width: handleNumberEmpty(value1?.width),
            qty: handleNumberEmpty(value1?.quantity),
          };
          list.push(object);
        }
        if (part === "input_2" && Object.keys(inputs)?.includes("input_2")) {
          const object = {
            name: inputs?.input_2?.material_code,
            material_details: value2?.details,
            thickness: handleNumberEmpty(value2?.thickness),
            width: handleNumberEmpty(value2?.width),
            qty: handleNumberEmpty(value2?.quantity),
          };
          list.push(object);
        }
      });
      body.input_materials[key] = list;
      const part = parts?.filter((x) => x.material_code === key)[0];
      body[`work_order_number_${i + 1}`] = part?.work_order_no;
    });

    if (!_.isEmpty(production) && !_.isEmpty(shop)) {
      let payload = {
        body: body,
        production_id: production?.id,
        shop_id: shop?.id,
        machine_name: machine?.value,
      };
      if (programData?.length) {
        payload = {
          ...payload,
          program_number: programData?.toString(),
        };
      }
      submitProduction(payload)
        .then((res) => {
          onSubmit();
          setInitiating(false);
        })
        .catch((ex) => {
          const err = getError(ex);
          const params = {
            open: true,
            message: err,
            type: "ERROR",
          };
          dispatch(setApplicationAlert(params));
          setParts([]);
          setInitiating(false);
          onClose();
        });
    }
  };

  const handleUpdate = () => {
    const payload = {
      shop_id: shop?.id,
      body: {},
    };
    const list = [];
    const recipe = inputs?.recipe;
    Object.keys(recipe)?.forEach((key, i) => {
      const filtered = partDetails?.filter(
        (x) => key === x?.part_obj?.material_code
      )[0];
      recipe[key]?.forEach((part, ind) => {
        if (part === "input_1" && Object.keys(inputs)?.includes("input_1")) {
          const object = {
            material_details: value1?.details || "NA",
            thickness: handleNumberEmpty(value1?.thickness),
            width: handleNumberEmpty(value1?.width),
            material_qty: handleNumberEmpty(value1?.quantity),
            production_id: production?.id,
            batch_id: filtered?.batch_list[0]?.id,
            part_name: inputs?.input_1?.material_code,
          };
          list.push(object);
        }
        if (part === "input_2" && Object.keys(inputs)?.includes("input_2")) {
          const object = {
            material_details: value2?.details || "NA",
            thickness: handleNumberEmpty(value2?.thickness),
            width: handleNumberEmpty(value2?.width),
            material_qty: handleNumberEmpty(value2?.quantity),
            production_id: production?.id,
            batch_id: filtered?.batch_list[0]?.id,
            part_name: inputs?.input_2?.material_code,
          };
          list.push(object);
        }
      });
    });
    payload.body["input_materials_list"] = list;
    setUpdateLoading(true);
    updateInputMaterials(payload)
      .then((res) => {
        setUpdateLoading(false);
        const params = {
          open: true,
          message: "Input material updated successfully",
          type: "SUCCESS",
        };
        dispatch(setApplicationAlert(params));
        onUpdate();
      })
      .catch((ex) => {
        setUpdateLoading(false);
        const err = getError(ex);
        const params = {
          open: true,
          message: err,
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  return (
    <DialogCard
      clickaway={clickaway}
      open={open}
      handleClose={onClose}
      maxWidth={"md"}
      fullWidth={true}
      title={"Select Input Material"}
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
        <Box
          className={classes["container-flex"]}
          sx={{ justifyContent: "end !important" }}
        >
          <Box className={classes["container-flex-start"]}>
            <ContentBox
              type="SECONDARY"
              placeholder="Part Name 1"
              value={parts[0]?.part_name || "NA"}
              part={parts[0]}
              editable={false}
            />
            <ContentBox
              type="SECONDARY"
              placeholder="Part Name 2"
              value={parts[1]?.part_name || "NA"}
              part={parts[1]}
              editable={false}
            />
          </Box>
        </Box>
        <Divider sx={{ mb: "1.2rem", mt: "1.6rem" }} />
        <TableLayout
          loading={false}
          className={classes["prodigi-dialog-table-dimensions"]}
        >
          <TableContainer
            className={`${classes["prodigi-dialog-table"]} prodigi-dialog-table`}
          >
            <MuiTable stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ width: columnWidth.name }}>
                    Input Material Name
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.code }}>
                    Input Material Code
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.details }}>
                    Material Details
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.thickness }}>
                    Material Thickness
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.width }}>
                    Material Width
                  </TableCell>
                  <TableCell align="left" sx={{ width: columnWidth.quantity }}>
                    Material Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes["prodigi-table-body"]}>
                {!loading && inputs?.input_1 && (
                  <TableRow>
                    <TableCell align="left" sx={{ width: columnWidth.name }}>
                      {inputs?.input_1?.part_name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.code }}>
                      {inputs?.input_1?.material_code || ""}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.details }}>
                      <TextInput
                        sx={{ width: "12rem" }}
                        value={value1.details}
                        id={"details1"}
                        name="details"
                        error={error1.details}
                        onChange={handleChange1}
                        onBlur={handleValidate1}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.thickness }}
                    >
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value1.thickness}
                            id={"thickness1"}
                            name="thickness"
                            error={error1.thickness}
                            onChange={handleChange1}
                            onBlur={handleValidate1}
                          />
                        </Box>
                        {inputs?.input_1?.thickness_unit}
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.width }}>
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value1.width}
                            id={"width1"}
                            name="width"
                            error={error1.width}
                            onChange={handleChange1}
                            onBlur={handleValidate1}
                          />
                        </Box>
                        {inputs?.input_1?.width_unit}
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.quantity }}
                    >
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value1.quantity}
                            id={"quantity1"}
                            name="quantity"
                            error={error1?.quantity}
                            onChange={handleChange1}
                            onBlur={handleValidate1}
                          />
                        </Box>
                        {inputs?.input_1?.weight_unit}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && inputs?.input_2 && (
                  <TableRow>
                    <TableCell align="left" sx={{ width: columnWidth.name }}>
                      {inputs?.input_2?.part_name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.code }}>
                      {inputs?.input_2?.material_code || ""}
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.details }}>
                      <TextInput
                        sx={{ width: "12rem" }}
                        value={value2.details}
                        id={"details2"}
                        name="details"
                        error={error2.details}
                        onChange={handleChange2}
                        onBlur={handleValidate2}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.thickness }}
                    >
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value2.thickness}
                            id={"thickness2"}
                            name="thickness"
                            error={error2.thickness}
                            onChange={handleChange2}
                            onBlur={handleValidate2}
                          />
                        </Box>
                        {inputs?.input_2?.thickness_unit}
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ width: columnWidth.width }}>
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value2.width}
                            id={"width2"}
                            name="width"
                            error={error2.width}
                            onChange={handleChange2}
                            onBlur={handleValidate2}
                          />
                        </Box>
                        {inputs?.input_2?.width_unit}
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ width: columnWidth.quantity }}
                    >
                      <Box className={classes["material-fields"]}>
                        <Box sx={{ width: "7rem" }}>
                          <TextInput
                            sx={{ width: "7rem" }}
                            type="number"
                            min={0}
                            value={value2.quantity}
                            id={"quantity2"}
                            name="quantity"
                            error={error2?.quantity}
                            onChange={handleChange2}
                            onBlur={handleValidate2}
                          />
                        </Box>
                        {inputs?.input_2?.weight_unit}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </MuiTable>
            {loading && (
              <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
                <Loader size="SMALL" />
              </Box>
            )}
            <Box
              sx={{
                // border:"1px solid red",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                paddingBottom: "1rem",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                {!value1.details ||
                (inputs?.input_2 && (!value1.details || !value2.details))
                  ? Object.values(messages)?.map((item, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{
                          color: Red,
                          mb: 0.6,

                          display: item === "" ? "none" : "inherit",
                        }}
                      >
                        {item}
                      </Typography>
                    ))
                  : null}
              </Box>
            </Box>
          </TableContainer>
        </TableLayout>
        <Divider sx={{ mb: "1.2rem" }} />
        <ButtonContainer type="RIGHT">
          {productionInitiated ? (
            <PrimaryButton
              sx={{ width: "11.6rem !important" }}
              onClick={handleUpdate}
              disabled={updateLoading}
              // onHover={handleValidate}
            >
              {updateLoading ? <Loader size="SMALL" /> : <>Update</>}
            </PrimaryButton>
          ) : (
            <ButtonContainer type="RIGHT">
              <SecondaryButton
                disabled={initiating}
                sx={{ width: "11.6rem !important" }}
                onClick={onPrevious}
              >
                Previous
              </SecondaryButton>
              <PrimaryButton
                disabled={initiating}
                sx={{ width: "11.6rem !important" }}
                onClick={handleFinish}
              >
                Finish
              </PrimaryButton>
            </ButtonContainer>
          )}
        </ButtonContainer>
      </DialogContent>
    </DialogCard>
  );
};

export default InputMaterial;
