import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {Tooltip,useTheme,Box,Typography,Grid, Card, CardContent} from "@mui/material";
import {tokens} from "../theme"
import { AlertTriangle, BatteryFull ,Power} from 'lucide-react';
import fuse from '.././enums/electronic-fuse.png'
import { ChargerTrip, StringCurrent, ACVoltage, DCVoltage, Buzzer } from '.././enums/ThresholdValues'

import {
  Box,
  Paper,
  Typography,
  Button,
  Modal,
  useTheme,
  Container,
  Grid,
  Card,CardContent
} from "@mui/material";
import{ToggleLeft,Radio} from 'lucide-react';
import { tokens } from "../theme";
import {
  Warning as AlertTriangle,
  BatteryFull as BatteryFull,
  Power as Power,
  TripOrigin as ChargerTrip,
  Bolt as ACVoltage,
  BatteryChargingFull as DCVoltage,
  NotificationsActive as Buzzer
} from '@mui/icons-material';
import {Charging,Discharging,FuseIcon} from '../enums/ThresholdValues'
export default Alerts = ({ charger ,bmsalarms }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

    const {
    bankCycleDC, // Battery Status
    stringVoltageLHN, // String Voltage
    cellCommunicationFD, // String Communication Status
    socLN, // State of Charge
    stringCurrentHN, // String Current
    ambientTemperatureHN, // Ambient Temperature
    buzzer, // Buzzer
  } = bmsalarms;
  const{
    inputMains,
    inputFuse,
    rectifierFuse,
    filterFuse,
    dcVoltageOLN,
    outputFuse,
    acUnderVoltage,
    chargerLoad,
    alarmSupplyFuse,
    chargerTrip,
    outputMccb,
    acVoltageULN,
    batteryCondition,
    testPushButton,
    resetPushButton
      }=charger[0]
  const detailsMap = {
    bankCycleDC: "Battery status",
    cellCommunicationFD: "String Communication",
    buzzer: "Buzzer",
    cellVoltageLHN: "Cell Voltage",
    inputMains: "Input Mains",
    inputFuse: "Input Fuse",
    rectifierFuse: "Rectifier fuse",
    filterFuse: "Filter Fuse",
    dcVoltageOLN: "DC Voltage",
    outputFuse: "Output Fuse",
    chargerLoad: "Charger Load",
    alarmSupplyFuse: "Alarm Fuse",
    chargerTrip: "Charger Trip",
    outputMccb: "Output Mccb",
    acVoltageULN: "AC Voltage",
    batteryCondition: "Battery Condition",
    resetPushButton: "Reset Button",
  };
  const combinedData = { ...bmsalarms, ...charger[0] };
  const getSeverityFromBit = (bit) => {
    console.log("Bit Value Received:", bit);
    switch (bit) {
      case 0:
        return { status: "Low", severity: "low" };
      case 1:
        return { status: "Normal", severity: "medium" };
      case 2:
        return { status: "High", severity: "high" };
      default:
        return { status: "Unknown", severity: "medium" };
    }
  };

  const alerts = Object.keys(detailsMap).map((key, index) => {
    let status = "Unknown";
    let severity = "medium";
    let IconComponent = null;

    if (
      key === "cellVoltageLHN" ||
      key === "dcVoltageOLN" ||
      key === "acVoltageULN"
    ) {
      const bitValue = combinedData[key];
      ({ status, severity } = getSeverityFromBit(bitValue));
    } else if (key === "chargerTrip") {
      status = combinedData[key] ? "Normal" : "Tripped";
      severity = combinedData[key] ? "medium" : "high";
    } else if(key==="bankCycleDC"){
      status = combinedData[key] ? "Discharging" : "Charging";
      severity = combinedData[key] ? "high" : "medium";
    }
    else {
      status = combinedData[key] ? "Normal" : "Failure";
      severity = combinedData[key] ? "medium" : "high";
    }

    // Assign the appropriate SVG component based on the alert type
    if (key === "bankCycleDC") {
      IconComponent = combinedData[key] ?  Discharging: Charging;
    } else if (key === "chargerTrip") {
      IconComponent = ChargerTrip;
    } else if (key === "acVoltageC") {
      IconComponent = ACVoltage;
    } else if (key === "dcVoltageOLN") {
      IconComponent = DCVoltage;
    } else if (key === "resetPushButton") {
      IconComponent = Buzzer;
    } else if (key === "inputMains") {
      IconComponent = () => <Power size={20} style={{ color: "#B71C1C" }} />;
    } else if (key === "buzzer") {
      IconComponent = Buzzer;
    } else if (key === "cellCommunicationFD") {
      IconComponent = () => <Radio size={20} style={{ color: "#0D47A1" }} />;
    } else if (key === "batteryCondition") {
      IconComponent = BatteryFull;
    } else if (key === "outputMccb") {
      IconComponent = () => (
        <ToggleLeft size={20} style={{ color: "#0D47A1" }} />
      );
    }else{
      IconComponent=()=> <FuseIcon></FuseIcon>
    }

    // Use AlertTriangle for Failure, Low, High, Tripped states
    if (
      status === "Failure" ||
      status === "Low" ||
      status === "High" ||
      status === "Tripped"
    ) {
      IconComponent = () => (
        <AlertTriangle size={20} style={{ color: "#B71C1C" }} />
      );
    }

    return {
      id: index + 1,
      status,
      details: detailsMap[key],
      severity,
      IconComponent,
    };
  });

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return { backgroundColor: "#FFCDD2", color: "#B71C1C" };
      case "medium":
        return { backgroundColor: "#C8E6C9", color: "#1B5E20"};
      case "low":
        return { backgroundColor: "#BBDEFB", color: "#0D47A1" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        justifyContent="center"
      >
        <Typography
          mt="5px"
          variant="h3"
          sx={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Alarms
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ padding: 2, width: "100%" }}
      >
        {alerts.map((alert) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={alert.id}>
            <Card
              style={{
                ...getSeverityStyles(alert.severity),
                borderRadius: 8,
                transition: "transform 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                minWidth: 80,
                height: 90,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <CardContent style={{ textAlign: "center", padding: 5 }}>
                <div>
                  {alert.IconComponent ? (
                    <alert.IconComponent />
                  ) : (
                    <>
                      {alert.severity === "high" && (
                        <AlertTriangle size={20} style={{ color: "#B71C1C" }} />
                      )}
                      {alert.severity === "medium" && (
                        <BatteryFull size={20} style={{ color: "#F57F17" }} />
                      )}
                      {alert.severity === "low" && (
                        <AlertTriangle size={20} style={{ color: "#0D47A1" }} />
                      )}
                    </>
                  )}
                </div>
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: 12, fontWeight: "bold" }}
                >
                  {alert.status}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12, marginBottom: 1 }}
                >
                  {alert.details}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

