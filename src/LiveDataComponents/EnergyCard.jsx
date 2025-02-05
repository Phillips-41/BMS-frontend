import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme"; // Assuming you have a theme file
import BatteryFullIcon from "@mui/icons-material/BatteryFull"; // Energy icon

export default EnergyCard = ({ energyValue, unit = "kWh" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        p: 2, // Padding
        borderRadius: 3, // Rounded corners
        bgcolor: colors.primary[400], // Background color
        maxWidth: 250, // Limit card width
        textAlign: "center", // Center align content
        margin: "0 auto", // Center the card
      }}
    >
      <CardContent>
        {/* Icon Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2, // Margin below the icon
          }}
        >
          <BatteryFullIcon
            sx={{
              fontSize: "3rem", // Icon size
              color: colors.greenAccent[500], // Icon color
            }}
          />
        </Box>

        {/* Energy Value Section */}
        <Typography
          variant="h3" // Large font size for the value
          sx={{
            fontWeight: "bold",
            color: colors.grey[100],
          }}
        >
          {energyValue} {unit}
        </Typography>

        {/* Label Section */}
        <Typography
          variant="h6" // Smaller font size for the label
          sx={{
            mt: 1, // Margin above the label
            color: colors.grey[300],
          }}
        >
          Energy
        </Typography>
      </CardContent>
    </Card>
  );
};
