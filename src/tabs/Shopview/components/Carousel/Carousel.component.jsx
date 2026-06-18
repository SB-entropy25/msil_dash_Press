import SingleLeft from "@mui/icons-material/KeyboardArrowLeft";
import DoubleLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import DoubleRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import SingleRight from "@mui/icons-material/NavigateNext";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import MachineStatusCard from "../MachineStatusCard/MachineStatusCards.component";
import useStyles from "./Carousal.styles";

function Carousel({ filters, data, handleTarget = () => {} }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const statusOrder = ["BREAKDOWN", "IDEL", "RUNNING"];

  const michineData = data
    .sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    )
    .sort((a, b) => b.critical - a.critical)
    .reduce((acc, item, index) => {
      if (index % 4 === 0) {
        acc.push([item]);
      } else {
        acc[acc.length - 1].push(item);
      }
      return acc;
    }, []);

  useEffect(() => {
    if (filters) {
      setActiveStep(0);
    }
  }, [filters]);

  useEffect(() => {
    if (michineData.length) {
      const interval = setInterval(() => {
        const count = Number(activeStep + 1) % Number(michineData.length);
        setActiveStep(count);
      }, 30000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [michineData]);

  const handleNavigation = (name, idx) => {
    switch (name) {
      case "firstSlide": {
        if (activeStep != 0) {
          setActiveStep(0);
        }
        break;
      }
      case "nextSlide": {
        if (activeStep < michineData.length - 1) {
          setActiveStep(activeStep + 1);
        }
        break;
      }
      case "prevSlide": {
        if (activeStep > 0) {
          setActiveStep(activeStep - 1);
        }
        break;
      }
      case "lastSlide": {
        if (activeStep !== michineData.length - 1) {
          setActiveStep(michineData.length - 1);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        height="91%"
        width="100%"
      >
        {michineData[activeStep]?.map((row, rowIndex) => (
          <MachineStatusCard
            item={row}
            key={(rowIndex + 2).toString()}
            handleTarget={handleTarget}
          />
        ))}
      </Box>
      {michineData.length > 0 && (
        <Box className={classes["shopView-stepper"]} marginTop="1.5rem">
          <IconButton
            onClick={() => handleNavigation("firstSlide")}
            disabled={activeStep === 0}
          >
            <DoubleLeft
              sx={{
                color: activeStep === 0 ? "#D9D9D9" : "#2D3394",
                fontSize: "2.6rem",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => handleNavigation("prevSlide", activeStep - 1)}
            disabled={activeStep === 0}
          >
            <SingleLeft
              sx={{
                color: activeStep === 0 ? "#D9D9D9" : "#2D3394",
                fontSize: "2.6rem",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => handleNavigation("nextSlide")}
            disabled={activeStep === michineData.length - 1}
          >
            <SingleRight
              sx={{
                color:
                  activeStep === michineData.length - 1 ? "#D9D9D9" : "#2D3394",
                fontSize: "2.6rem",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() =>
              handleNavigation("lastSlide", Number(michineData.length) - 1)
            }
            disabled={activeStep === michineData.length - 1}
          >
            <DoubleRight
              sx={{
                color:
                  activeStep === michineData.length - 1 ? "#D9D9D9" : "#2D3394",
                fontSize: "2.6rem",
              }}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
}
export default Carousel;
