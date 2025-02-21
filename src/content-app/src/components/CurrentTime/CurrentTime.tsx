import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { getDateTime, getFormattedDateTime } from "@/utils/date";

interface CurrentTimeProps {
  textStyles?: React.CSSProperties;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ textStyles }): React.ReactNode => {
  const [currentTime, setCurrentTime] = useState(getDateTime());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getDateTime());
    }, 1000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  return (
    <div className="current-date-time">
      <Typography
        variant="h6"
        sx={textStyles || {}}
      >
        {getFormattedDateTime(currentTime, "dddd DD MMM YYYY, hh:mm A")}
      </Typography>
    </div>
  );
};

export default CurrentTime;
