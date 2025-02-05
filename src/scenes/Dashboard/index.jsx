import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchCommunicationStatus } from "../../services/apiService";
import DataDialog from "./DataDialog"
import DataDialogComm from"./DataDialogComm"
import PieChartComponent2 from './PieChartComponent2';
import PieChartComponent from './PieChartComponent';
import MapComponent from './MapComponent';
import {Box,Grid,} from "@mui/material";
import "leaflet/dist/leaflet.css";
import DashBoardBar from "../Dashboard/DashBoardBar/DashBoardBar";
import { AppContext } from "../../services/AppContext";



const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedcategory, setSelectedcategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data = [],mapMarkers, setMapMarkers } = useContext(AppContext);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [marginMinutes, setMarginMinutes] = useState(60);
  // const [mapMarkers, setMapMarkers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [siteId, setSiteId] = useState(''); 
  const [barChartData, setBarChartData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch communication status data
        const data = await fetchCommunicationStatus(marginMinutes);
        console.log("Fetched Communication Data:", data);

        let communicatingCount = 0;
        let nonCommunicatingCount = 0;


        let MostCriticalCount = 0;
        let CriticalCount = 0;
        let MajorCount = 0;
        
        let MinorCount = 0;
        const markers = [];

        data.forEach((item) => {
          
          if (item.statusType === 1) communicatingCount++;
          else if (item.statusType === 0) nonCommunicatingCount++;

          const MostCriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMostCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MostCriticalConditions || ChargerMonitoringMostCritical) {
            if (
              MostCriticalConditions?.stringVoltageLNH === 0 ||      // String Voltage Low
              MostCriticalConditions?.cellVoltageLNH === 0 ||        // Cell Voltage Low
              MostCriticalConditions?.socLN === true ||              // SOC Low
              MostCriticalConditions?.batteryCondition === true ||   // Battery Open
              ChargerMonitoringMostCritical?.chargerTrip === true    // Charger Trip
            ) {
              MostCriticalCount++;
            }
          }
          
          console.log(MostCriticalCount);
          

          const CriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (CriticalConditions || ChargerMonitoringCritical) {
            if (
              CriticalConditions?.stringVoltageLNH === 2 ||              // String Voltage High
              CriticalConditions?.cellVoltageLNH === 2 ||                // Cell Voltage High
              CriticalConditions?.stringCurrentHN === true ||            // String Current High
              ChargerMonitoringCritical?.inputMains === true ||          // Input Mains Failure
              ChargerMonitoringCritical?.inputPhase === true ||          // Input Phase Failure
              ChargerMonitoringCritical?.rectifierFuse === true ||       // Rectifier Fuse Failure
              ChargerMonitoringCritical?.filterFuse === true ||          // Filter Fuse Failure
              ChargerMonitoringCritical?.outputMccb === true ||          // Output MCCB Failure
              ChargerMonitoringCritical?.batteryCondition === true ||    // Battery Condition Failure
              ChargerMonitoringCritical?.inputFuse === true ||           // Input Fuse Failure
              ChargerMonitoringCritical?.acVoltageULN === 2              // AC Voltage Abnormal
            ) {
              CriticalCount++;
            }
          }
          
          console.log(CriticalCount);
          

          const MajorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MajorConditions || ChargerMonitoring) {
            const isMajorCondition =
              MajorConditions?.ambientTemperatureHN === true ||  // Ambient Temperature High
              MajorConditions?.cellCommunication === true ||     // Cell Communication Failure
              ChargerMonitoring?.dcVoltageOLN === 2 ||           // DC Over Voltage Detection
              ChargerMonitoring?.dcVoltageOLN === 0 ||           // DC Under Voltage Detection
              ChargerMonitoring?.acVoltageULN === 0 ||           // AC Under Voltage Detection
              ChargerMonitoring?.outputFuse === true;            // Output Fuses Failure Detection
          
            if (isMajorCondition) {
              MajorCount++;
            }
          }
   
          const MinorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMinor = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MinorConditions || ChargerMonitoringMinor) {
            const isMinorCondition =
              MinorConditions?.bankDischargeCycle === true ||      // Battery Status (Discharging)
              MinorConditions?.bmsSedCommunication === true || // String Communication
              MinorConditions?.cellTemperatureHN === true ||   // Cell Temperature High
              MinorConditions?.buzzer === true ||              // Buzzer Alarm
              ChargerMonitoringMinor?.chargerLoad === true ||  // Charger Load Detection
              ChargerMonitoringMinor?.alarmSupplyFuse === true 
              ChargerMonitoringMinor?.testPushButton === true 
              ChargerMonitoringMinor?.resetPushButton === true 
              // Alarm Supply Fuse Detection
          
            if (isMinorCondition) {
              MinorCount++;
            }
          }
        // Add marker data for map
          if (item.siteLocationDTO) {
            const { latitude, longitude, area ,vendorName} = item.siteLocationDTO;
            if (latitude && longitude) {
              markers.push({
                lat: latitude,
                lng: longitude,
                name: area || "Unnamed Site",
                vendor:vendorName ,
                statusType: item.statusType ,
                 // Add the statusType here
              });
            }
          }
          console.log("Marker Data:", markers);
        });

        // Set the transformed data for the first set of stats
        setData1([
          { name: "Communicating", value: communicatingCount },
          { name: "Non-Communicating", value: nonCommunicatingCount },
        ]);

        // Set the transformed data for the second set of stats
        setData2([
          { name: "Most Critical Count", value: MostCriticalCount },
          { name: "Critical Count", value: CriticalCount },
          { name: "Major Count", value: MajorCount },
          { name: "Minor Count", value: MinorCount },
        ]);

        // Update map markers
        setMapMarkers(markers);
      

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [marginMinutes]); 

  const handlePieClick = (data) => {
    // Set the selected status
    setSelectedStatus(data.name);
  
    setOpenDialog(true);
  
    const alarmCounts = {
      stringVoltageLNH: 0,
      cellVoltageLNH: 0,
      socLN: 0,
      batteryCondition: 0,
      chargerTrip: 0,
      stringVoltageLNHHigh: 0,
      cellVoltageLNHHigh: 0,
      stringCurrentHN: 0,
      inputMains: 0,
      inputPhase: 0,
      rectifierFuse: 0,
      filterFuse: 0,
      outputMccb: 0,
      inputFuse: 0,
      acVoltageULN: 0,
      ambientTemperatureHN: 0,
      cellCommunication: 0,
      dcVoltageOLN: 0,
      acVoltageOLN: 0,
      buzzer: 0,
      chargerLoad: 0,
      alarmSupplyFuse: 0,
      testPushButton: 0,
      resetPushButton: 0
    };
  
    // Fetch and aggregate the alarm data
    const fetchDataForStatus = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);
        let filteredData;
        let chartData = [];
  
        // Filter data based on the selected pie slice
        switch (data.name) {
          case 'Most Critical Count':
            filteredData = response.filter(item => {
              const MostCriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || [];
  
              return (
                MostCriticalConditions?.stringVoltageLNH === 0 ||      // String Voltage Low
                MostCriticalConditions?.cellVoltageLNH === 0 ||        // Cell Voltage Low
                MostCriticalConditions?.socLN === true ||              // SOC Low
                MostCriticalConditions?.batteryCondition === true ||   // Battery Open
                chargerMonitoring?.chargerTrip === true  
              );
            });
  
            // Update alarm counts for Most Critical Count
            filteredData.forEach(item => {
              const conditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || [];
  
              if (conditions?.stringVoltageLNH === 0) alarmCounts.stringVoltageLNH++;
              if (conditions?.cellVoltageLNH === 0) alarmCounts.cellVoltageLNH++;
              if (conditions?.socLN === true) alarmCounts.socLN++;
              if (conditions?.batteryCondition === true) alarmCounts.batteryCondition++;
              if (chargerMonitoring?.chargerTrip === true) alarmCounts.chargerTrip++;
            });
  
            // Generate alarm combinations for Most Critical Count
            chartData = [
              {
                name: "String(V) Low",
                count: filteredData.filter(
                  (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0
                ).length,
                details: filteredData
                  .filter((item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0)
                  .map((item) => ({
                    siteId: item.siteId,
                    serialNumber: item.serialNumber,
                  })),
              },
              {
                name: "Cell(V) Low",
                count: filteredData.filter(
                  (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLNH === 0
                ).length,
                details: filteredData
                  .filter((item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLNH === 0)
                  .map((item) => ({
                    siteId: item.siteId,
                    serialNumber: item.serialNumber,
                  })),
              },
              // Add other alarm types similarly
            ];
            setBarChartData(chartData);
            break;
    
          // Add cases for "Critical Count", "Major Count", and "Minor Count" similarly
        
    
        // Update the bar chart with the corresponding alarm data
        
  
          case 'Critical Count':
            filteredData = response.filter(item => {
              const CriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const ChargerMonitoringCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
  
              return (
                CriticalConditions?.stringVoltageLNH === 2 ||              // String Voltage High
                CriticalConditions?.cellVoltageLNH === 2 ||                // Cell Voltage High
                CriticalConditions?.stringCurrentHN === true ||            // String Current High
                ChargerMonitoringCritical?.inputMains === true ||          // Input Mains Failure
                ChargerMonitoringCritical?.inputPhase === true ||          // Input Phase Failure
                ChargerMonitoringCritical?.rectifierFuse === true ||       // Rectifier Fuse Failure
                ChargerMonitoringCritical?.filterFuse === true ||          // Filter Fuse Failure
                ChargerMonitoringCritical?.outputMccb === true ||          // Output MCCB Failure
                ChargerMonitoringCritical?.inputFuse === true ||           // Input Fuse Failure
                ChargerMonitoringCritical?.acVoltageULN === 2 
              );
            });
  
            // Update alarm counts for Critical Count
            filteredData.forEach(item => {
              const CriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const ChargerMonitoringCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
  
              if (CriticalConditions?.stringVoltageLNH === 2) alarmCounts.stringVoltageLNHHigh++;
              if (CriticalConditions?.cellVoltageLNH === 2) alarmCounts.cellVoltageLNHHigh++;
              if (CriticalConditions?.stringCurrentHN === true) alarmCounts.stringCurrentHN++;
              if (ChargerMonitoringCritical?.inputMains === true) alarmCounts.inputMains++;
              if (ChargerMonitoringCritical?.inputPhase === true) alarmCounts.inputPhase++;
              if (ChargerMonitoringCritical?.rectifierFuse === true) alarmCounts.rectifierFuse++;
              if (ChargerMonitoringCritical?.filterFuse === true) alarmCounts.filterFuse++;
              if (ChargerMonitoringCritical?.outputMccb === true) alarmCounts.outputMccb++;
              if (ChargerMonitoringCritical?.inputFuse === true) alarmCounts.inputFuse++;
              if (ChargerMonitoringCritical?.acVoltageULN === 2) alarmCounts.acVoltageULN++;
            });
  
            // Generate alarm combinations for Critical Count
            chartData = [
              { name: 'String(V) High', count: alarmCounts.stringVoltageLNHHigh },
              { name: 'Cell(V) High', count: alarmCounts.cellVoltageLNHHigh },
              { name: 'String(A) High', count: alarmCounts.stringCurrentHN },
              { name: 'Input Mains Fail', count: alarmCounts.inputMains },
              { name: 'Input Phase Fail', count: alarmCounts.inputPhase },
              { name: 'Rectifier Fuse Fail', count: alarmCounts.rectifierFuse },
              { name: 'Filter Fuse Fail', count: alarmCounts.filterFuse },
              { name: 'Output MCCB Fail', count: alarmCounts.outputMccb },
              { name: 'Input Fuse Fail', count: alarmCounts.inputFuse },
              { name: 'AC(V) ULN', count: alarmCounts.acVoltageULN }
            ];
            break;
  
          case 'Major Count':
            filteredData = response.filter(item => {
              const MajorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
          
              return (
                MajorConditions?.ambientTemperatureHN === true ||  // Ambient Temperature High
                MajorConditions?.cellCommunication === true ||     // Cell Communication Failure
                chargerMonitoring?.dcVoltageOLN === 2 ||           // DC Over Voltage Detection
                chargerMonitoring?.dcVoltageOLN === 0 ||           // DC Under Voltage Detection
                chargerMonitoring?.acVoltageULN === 0 ||           // AC Under Voltage Detection
                chargerMonitoring?.outputFuse === true             // Output Fuse Failure
              );
            });
          
            // Update alarm counts for Major Count
            filteredData.forEach(item => {
              const conditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
          
              if (conditions?.ambientTemperatureHN === true) alarmCounts.ambientTemperatureHN++;
              if (conditions?.cellCommunication === true) alarmCounts.cellCommunication++;
              if (chargerMonitoring?.dcVoltageOLN === 2) alarmCounts.dcVoltageOLN++;
              if (chargerMonitoring?.dcVoltageOLN === 0) alarmCounts.dcVoltageOLN++;
              if (chargerMonitoring?.acVoltageULN === 0) alarmCounts.acVoltageULN++;
              if (chargerMonitoring?.outputFuse === true) alarmCounts.outputFuse++;
            });
          
            // Generate alarm combinations for Major Count
            chartData = [
              { name: 'Ambient Temperature High', count: alarmCounts.ambientTemperatureHN },
              { name: 'Cell Communication Failure', count: alarmCounts.cellCommunication },
              { name: 'DC Over Voltage Detection', count: alarmCounts.dcVoltageOLN },
              { name: 'DC Under Voltage Detection', count: alarmCounts.dcVoltageOLN },
              { name: 'AC Under Voltage Detection', count: alarmCounts.acVoltageULN },
              { name: 'Output Fuse Failure', count: alarmCounts.outputFuse }
            ];
            break;
  
          case 'Minor Count':
            filteredData = response.filter(item => {
              const MinorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoringMinor = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
          
              return (
                MinorConditions?.bmsSedCommunication === true ||    // Battery Status (Discharging)
                MinorConditions?.stringCommunication === true ||   // String Communication
                MinorConditions?.cellTemperatureHN === true ||    // Cell Temperature High
                MinorConditions?.buzzer === true ||                // Buzzer Alarm
                chargerMonitoringMinor?.chargerLoad === true ||    // Charger Load Detection
                chargerMonitoringMinor?.alarmSupplyFuse === true ||// Alarm Supply Fuse Failure
                chargerMonitoringMinor?.testPushButton === true || // Test Push Button Pressed
                chargerMonitoringMinor?.resetPushButton === true   // Reset Push Button Pressed
              );
            });
          
            // Update alarm counts for Minor Count
            filteredData.forEach(item => {
              const conditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
              const chargerMonitoringMinor = item?.generalDataDTO?.chargerMonitoringDTO?.[0] || [];
          
              if (conditions?.bmsSedCommunication === true) alarmCounts.bmsSedCommunication++;
              if (conditions?.stringCommunication === true) alarmCounts.stringCommunication++;
              if (conditions?.cellTemperatureHN === true) alarmCounts.cellTemperatureHN++;
              if (conditions?.buzzer === true) alarmCounts.buzzer++;
              if (chargerMonitoringMinor?.chargerLoad === true) alarmCounts.chargerLoad++;
              if (chargerMonitoringMinor?.alarmSupplyFuse === true) alarmCounts.alarmSupplyFuse++;
              if (chargerMonitoringMinor?.testPushButton === true) alarmCounts.testPushButton++;
              if (chargerMonitoringMinor?.resetPushButton === true) alarmCounts.resetPushButton++;
            });
          
            // Generate alarm combinations for Minor Count
            chartData = [
              { name: 'Battery Status (Discharging)', count: alarmCounts.bmsSedCommunication },
              { name: 'String Communication', count: alarmCounts.stringCommunication },
              { name: 'Cell Temperature High', count: alarmCounts.cellTemperatureHN },
              { name: 'Buzzer Alarm', count: alarmCounts.buzzer },
              { name: 'Charger Load Detection', count: alarmCounts.chargerLoad },
              { name: 'Alarm Supply Fuse Failure', count: alarmCounts.alarmSupplyFuse },
              { name: 'Test Push Button Pressed', count: alarmCounts.testPushButton },
              { name: 'Reset Push Button Pressed', count: alarmCounts.resetPushButton }
            ];
            break;
        }
  
        // Update the bar chart with the corresponding alarm data
        setBarChartData(chartData);
      } catch (error) {
        console.error('Error fetching communication status:', error);
      }
    };
  
    fetchDataForStatus();
  };
  const handlePieClickCommu = (data) => { 
    // Set the selected status
    setSelectedcategory(data.name);
  
    // Open the dialog on pie chart slice click
    setOpenDialog(true);
  
    // Dynamically set columns for the dialog
    setColumns([
      { field: 'siteId', headerName: 'Site ID' },
      { field: 'statusType', headerName: 'Status' },
      { field: 'vendor', headerName: 'Vendor' },
      { field: 'location', headerName: 'Location' },
      { field: 'cellsConnectedCount', headerName: 'Cells Count' },
      { field: 'stringVoltage', headerName: 'String Voltage' },
      { field: 'instantaneousCurrent', headerName: 'Instantaneous Current' },
      { field: 'ambientTemperature', headerName: 'Ambient Temperature' },
      { field: 'batteryRunHours', headerName: 'Battery Run Hours' },
    ]);
  
    const fetchDataForStatus = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);
        let filteredData = [];
  
        // Filter data based on the clicked slice (Communicating or Non-Communicating)
        switch (data.name) {
          case 'Communicating':
            filteredData = response.filter(item => item.statusType === 1); // statusType 1 = Communicating
            break;
          case 'Non-Communicating':
            filteredData = response.filter(item => item.statusType === 0); // statusType 0 = Non-Communicating
            break;
          default:
            filteredData = []; // No data for unknown status
        }
  
        // Map filtered data into table rows for dialog
        const newRows = filteredData.map((item) => ({
          siteId: item?.siteId || '--',
          statusType: item?.statusType === 1 ? 'Communicating' : 'Non-Communicating',
          vendor: item?.siteLocationDTO?.vendorName || '--',
          location: item?.siteLocationDTO?.area || '--',
          cellsConnectedCount: item?.generalDataDTO?.deviceDataDTO?.[0]?.cellsConnectedCount || 0,
          stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 0,
          instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
          ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
          batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
        }));
  
        // Set rows for the table in the dialog
        setRows(newRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call the function to fetch data
    fetchDataForStatus();
  };
  
  
  


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatus(null);
  };
  const handleOpenDialog = () => setOpenDialog(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSearch = (newSiteId) => {
    setSiteId(newSiteId); // Update the siteId state when search is triggered
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };
  // Gradient colors for pie charts
  const COLORS = ['#28a745', '#f39c12', '#17a2b8', '#6c757d', '#007bff', '#d9534f'];

  return (
    <Box className="dashboard-container" sx={{ padding: 1 ,
      border: '1px solid black',   // Adding black border
        
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'  }}>
       <DashBoardBar onSearch={handleSearch} />
      <Grid container spacing={3}>
        {/* Left Side - Map */}
        <Grid item xs={12} md={7}>
        <MapComponent mapMarkers={mapMarkers} />
        </Grid>

        {/* Right Side - Pie Charts */}
        <Grid item xs={12} md={5}>
            <Grid container spacing={1} direction="column" alignItems="center" >
              {/* Communication Status Pie Chart */}
              <Grid item>
              <PieChartComponent2 data1={data1} handlePieClick={handlePieClickCommu} />
              </Grid>

              {/* BMS Alarms Pie Chart */}
              <Grid item>
              <PieChartComponent data2={data2} handlePieClick={handlePieClick} />
                </Grid>

            </Grid>
        
        </Grid>
      </Grid>

    

      <DataDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedStatus={selectedStatus}
        barChartData={barChartData}
      />
 {/* <DataDialogComm 
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedcategory={selectedcategory}
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />  */}
    </Box>
  );
};

export default Dashboard;
