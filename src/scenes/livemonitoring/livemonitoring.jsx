import { Box, Paper, Typography, Button, Modal,useTheme, Container} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../theme";
import ManufacturerDetails from "../../LiveDataComponents/ManufacturerDetails";
import DischargeCycleWise from "../../LiveDataComponents/DischargeCycleWise";
import Cummulative from "../../LiveDataComponents/Cummulative";
import ChargeCycleWise from "../../LiveDataComponents/ChargeCycleWise";
import MapWithMarker from "../../LiveDataComponents/MapWithMarker";
import Topbar from "../global/Topbar";
import { AppContext } from "../../services/AppContext";
import CellsData from "../../LiveDataComponents/CellsData";
import Alerts from "../../LiveDataComponents/Alerts";
import Legends from "../../LiveDataComponents/Legends";
import Charger from "../../LiveDataComponents/Charger";
import InstantNCharger from "../../LiveDataComponents/InstantNCharger";

const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    Mdata,
    data,
    location,
    charger,
    siteId
  }=useContext(AppContext)
 
  // if (!Mdata) return <div> <Topbar /></div>;
  // if (data.length === 0) return <div> <Topbar /></div>;
  const {packetDateTime}=data || "";
  const device = data[0];
  if (!device) return <div> <Topbar /></div>;

  const {
    id,
    firstUsedDate,
    batterySerialNumber,
    batteryBankType,
    ahCapacity,
    manifactureName,
    designVoltage,
    individualCellVoltage,
  } = Mdata;
  const {
    locationName = "Unknown Location", // Default value if locationName is falsy
    latitude = 0,                     // Default latitude (could use a fallback like 0 or a center point)
    longitude = 0,                    // Default longitude
    vendorName = "Unknown Vendor",    // Default vendor name
    batteryAHCapacity = "Not Specified", // Default battery capacity
    area
  } = location || {}; // Handle case where location itself might be undefined
  
 
  const {
    deviceId, 
    bmsManufacturerID, 
    serialNumber, 
    installationDate, 
    cellsConnectedCount, 
    problemCells, 
    cellVoltageTemperatureData, 
    stringvoltage, 
    systemPeakCurrentInChargeOneCycle, 
    averageDischargingCurrent, 
    averageChargingCurrent, 
    ahInForOneChargeCycle, 
    ahOutForOneDischargeCycle, 
    cumulativeAHIn, 
    cumulativeAHOut, 
    chargeTimeCycle, 
    dischargeTimeCycle, 
    totalChargingEnergy, 
    totalDischargingEnergy, 
    everyHourAvgTemp, 
    cumulativeTotalAvgTempEveryHour, 
    chargeOrDischargeCycle, 
    socLatestValueForEveryCycle, 
    dodLatestValueForEveryCycle, 
    systemPeakCurrentInDischargeOneCycle, 
    instantaneousCurrent, 
    ambientTemperature, 
    batteryRunHours, 
    bmsalarms,
    serverTime
  } = device;
  const alertData = {
    bankCycleDC: true,
    stringVoltageLHN: 2, // High
    cellCommunicationFD: true,
    socLN: true,
    stringCurrentHN: true,
    ambientTemperatureHN: true,
    buzzer: false,
    cellVoltageLHN: 0, // Normal
      inputMains: true,
      inputFuse: true,
      rectifierFuse: true,
      filterFuse: true,
      dcVoltageOLN: 0,
      outputFuse: true,
      acUnderVoltage: true,
      chargerLoad: true,
      alarmSupplyFuse: true,
      chargerTrip: true,
      outputMccb: true,
      acVoltageC: 0,
      batteryCondition: true,
      testPushButton: true,
      resetPushButton: true
    };

  return (
    <Box
    sx={{
      display: "grid",
      gridTemplateRows: "min-content auto", // Topbar row is fixed, content row scrolls
      height: "100vh", // Full height of viewport
      overflow: "hidden", // Prevent grid overflow
    }}
  >
    {/* Topbar */}
    <Box
      sx={{
        gridRow: "1",
      }}
    ><Paper elevation={8}>
      <Topbar vendorName={vendorName} locationName={area}/>
      </Paper>
    </Box>
  
    {/* Scrollable Content */}
    <Box
  sx={{
    gridRow: "2",
    overflowY: "auto", // Enable vertical scrolling
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridAutoRows: " repeat(5, auto)", // Ensure consistent row heights
    gap: "10px", // Add spacing between grids
    padding: "10px", // Add padding to avoid content sticking to edges
    marginBottom:"30px"
  }}
  >
  {/* Legends */}
  <Box
    sx={{
      gridColumn: "1 / 6",
      padding: "2px",
    }}
  >
    <Legends cellVoltageTemperatureData={cellVoltageTemperatureData}/>
  </Box>

  {/* Cell */}
  <Box
    sx={{
      gridColumn: "1 / 4",
      height: "200px", // Explicit height
      overflow: "auto", // Scrollable if content overflows
    }}
  ><Paper elevation={8} sx={{  height: "200px"}} >
    <CellsData data={cellVoltageTemperatureData} siteId={siteId}
    serialNumber={serialNumber} bmsalarms={bmsalarms}/>
    </Paper>
  </Box>
  

  {/* Map */}
  <Box
    sx={{
      gridColumn: "4 / 6",
    }}
  ><Paper elevation={8}>
    <MapWithMarker
      locationName={locationName}
      latitude={latitude}
      longitude={longitude}
      vendorName={vendorName}
      batteryAHCapacity={batteryAHCapacity}
    />
    </Paper>
  </Box>

  {/* new grid */}
  <Box
    sx={{
      gridColumn: "1 / 6",
      //backgroundColor: colors.primary[400],
      // border: "1px solid black",
    }}
  >
    {/* <Instantaneous
      voltage={stringvoltage}
      current={instantaneousCurrent}
      soc={socLatestValueForEveryCycle}
      dod={dodLatestValueForEveryCycle}
      ambientTemperature={ambientTemperature}
    /> */}

    <InstantNCharger
     voltage={stringvoltage}
     current={instantaneousCurrent}
     soc={socLatestValueForEveryCycle}
     dod={dodLatestValueForEveryCycle}
     ambientTemperature={ambientTemperature}
     charger={charger}
     bmsalarms={bmsalarms}
    />
    
  </Box>

  {/* Alarms */}
  <Box
    sx={{
      gridColumn: "1 / 4",
      gridRow: "span 2", // Spanning three rows for proper height
      width: "550px"

    }}
  ><Paper elevation={8}>
      <Alerts  charger={charger}  bmsalarms={bmsalarms}/>
    </Paper>
  </Box>

  {/* Manufacturer */}
  <Box
    sx={{
      gridColumn: "4 / 5",
      width : "270px"
    }}
  ><Paper elevation={8}>
    <ManufacturerDetails
      firstUsedDate={firstUsedDate}
      batterySerialNumber={batterySerialNumber}
      batteryBankType={batteryBankType}
      serialNumber={serialNumber}
      ahCapacity={ahCapacity}
      manifactureName={manifactureName}
      individualCellVoltage={individualCellVoltage}
      designVoltage={designVoltage}
    />
  </Paper>
  </Box>

  {/* Discharge */}
  <Box
    sx={{
      gridColumn: "5 / 6",
     
    }}
  >
 
    {/* <Instantaneous
      voltage={stringvoltage}
      current={instantaneousCurrent}
      soc={socLatestValueForEveryCycle}
      dod={dodLatestValueForEveryCycle}
      ambientTemperature={ambientTemperature}
    /> */}
    <Paper elevation={8}>
    <Cummulative
      chargeDischargeCycles={chargeOrDischargeCycle}
      ampereHourIn={cumulativeAHIn}
      ampereHourOut={cumulativeAHOut}
      chargingEnergy={totalChargingEnergy}
      dischargingEnergy={totalDischargingEnergy}
      time={batteryRunHours}
    />
   </Paper>
  </Box>

  {/* Charge */}
  <Box
    sx={{
      gridColumn: "4 / 5",
     
    }}
  ><Paper elevation={8}>
    <ChargeCycleWise
      PeakChargeCurrent={systemPeakCurrentInChargeOneCycle}
      AverageChargeCurrent={averageChargingCurrent}
      AmpereHourIn={ahInForOneChargeCycle}
      totalSeconds={chargeTimeCycle}
    />
    </Paper>
  </Box>

  {/* Instant */}
  <Box
    sx={{
      gridColumn: "5 / 6",
      
    }}
  ><Paper elevation={8}>
    <DischargeCycleWise
      peakDischargeCurrent={systemPeakCurrentInDischargeOneCycle}
      averageDischargingCurrent={averageDischargingCurrent}
      ahOutForOneDischargeCycle={ahOutForOneDischargeCycle}
      totalSeconds={dischargeTimeCycle}
    />
    </Paper>
  </Box>

  {/* Charger */}
  {/* <Box
    sx={{
      gridColumn: "4 / 5",
      backgroundColor: colors.primary[400],
      border: "1px solid black",
    }}
  >
  <Charger charger={charger} ></Charger>
  </Box>
  <Box
    sx={{
      gridColumn: "5 / 6",
      backgroundColor: colors.primary[400],
      border: "1px solid black",
    }}
  >
    <Cummulative
      chargeDischargeCycles={chargeOrDischargeCycle}
      ampereHourIn={cumulativeAHIn}
      ampereHourOut={cumulativeAHOut}
      chargingEnergy={totalChargingEnergy}
      dischargingEnergy={totalDischargingEnergy}
      time={batteryRunHours}
    />
</Box> */}
  </Box>
  </Box>
  
  );
};

export default Bar;








