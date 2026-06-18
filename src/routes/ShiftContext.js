// ShiftContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ShiftContext = createContext();

const shifts = [
  { name: "Morning", start: "06:30", end: "15:14" }, // 6:30 AM - 3:14 PM
  { name: "Evening", start: "15:15", end: "23:59" }, // 3:15 PM - 11:59 PM
  { name: "Night", start: "00:00", end: "06:29" }, // 12 AM - 6:29 AM
];

function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentShift() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let shift of shifts) {
    const start = parseTimeToMinutes(shift.start);
    const end = parseTimeToMinutes(shift.end);

    // Handle overnight shift (end past midnight)
    if (end === 0) {
      if (currentMinutes >= start || currentMinutes < 60 * 24)
        return shift?.name;
    } else if (currentMinutes >= start && currentMinutes < end) {
      return shift?.name;
    }
  }
  return null;
}

export const ShiftProvider = ({ children }) => {
  const [activeShift, setActiveShift] = useState(getCurrentShift());

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShift(getCurrentShift());
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <ShiftContext.Provider value={{ activeShift, shifts }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => useContext(ShiftContext);
