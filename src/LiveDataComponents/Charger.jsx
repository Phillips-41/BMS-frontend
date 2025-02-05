import React from 'react'
import { Box, Typography,useTheme } from "@mui/material";
import { tokens } from "../theme.js"


export const Charger = ({charger}) => {
    const theme =useTheme();
    const colors=tokens(theme.palette.mode);
    const{deviceId,acVoltage,acCurrent ,frequency ,energy}=charger[0];


      return (
        <Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          mt="10px"
          ml="8px"
        >
          <Typography variant="h6" mb="10px">
            <strong>Charger Data</strong>
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
          >
            {[
              { label: "Device Id", value: deviceId },
              { label: "AC Voltage", value: acVoltage },
              { label: "AC Current", value: acCurrent },
              { label: "Frequency", value: frequency },
              { label: "Energy", value: energy },
              
            ].map(({ label, value }, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                gap="8px" // Adjust space between elements
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  style={{ minWidth: "130px" }} // Fixed width for labels
                >
                  {label}
                </Typography>
                <Typography
                  variant="h5"
                  style={{ color: "inherit" }} // Ensures colon inherits label's color
                >
                  :
                </Typography>
                <Typography
                  variant="h5"
                  style={{ color: colors.greenAccent[500] }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      );
}

export default Charger;