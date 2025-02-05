import { Box } from '@mui/material';
import React from 'react';
import TemperatureG from "./TemperatureG.jsx";
import VoltageG from "./VoltageG";


const VoltageBarChart = ({ data }) => {

  return (
   <Box marginBottom="10px">
    <VoltageG data={data}/>
    <TemperatureG data={data}/>
   </Box>
  );
};

export default VoltageBarChart;



