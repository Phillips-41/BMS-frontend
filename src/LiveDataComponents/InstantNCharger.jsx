import React from 'react'
import { tokens } from '../theme';

import { Card, CardContent, Typography, Grid, Box, CircularProgress,useTheme,Paper } from '@mui/material';
import chargerIcon from '../enums/portable-charger.png'

import PowerIcon from "@mui/icons-material/Power"; // Voltage icon
import BoltIcon from "@mui/icons-material/Bolt"; // Current icon
import ThermostatIcon from "@mui/icons-material/Thermostat"; // Temperature icon
import BatteryFullIcon from "@mui/icons-material/BatteryFull"; // Energy icon

import BatteryState from './BatteryState'
const InstantNCharger = ({ voltage,current,soc,dod,ambientTemperature, charger,bmsalarms}) => {
 const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const{deviceId,acVoltage,acCurrent ,frequency ,energy}=charger[0];
  const {
    stringVoltageLHN, 
    stringCurrentHN, ambientTemperatureHN, socLN// String Current
  } = bmsalarms;

      const [voltages, setVoltages] = React.useState({
        ac: {
          value: acVoltage,
          min: 220,
          max: 280,
          frequency: frequency,
          current: acCurrent
        },
      
      });
      // Create sine wave points for AC visualization
      const createSineWave = () => {
        const points = [];
        const steps = 200; // Increase steps for a smoother wave
        const amplitude = 40;
        const wavelength = 75; // Set wavelength equal to the animation offset
        
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * 400; // Extend beyond 300 for seamless animation
          const y = 50 + amplitude * Math.sin((i / steps) * Math.PI * 4);
          points.push(`${x},${y}`);
        }
      
        return points.join(' ');
      };

      const getSineWaveColor=()=>{
        return voltage/100<200 ? "blue": voltage/100>260? "red" :"green"
      }
      const [data, setData] = React.useState({
        voltage: {
          value: voltage,
          unit: "V",
          threshold: {
            normal: { min: 220, max: 240 },
            warning: { min: 210, max: 250 },
            critical: { min: 0, max: 210 },
          },
        },
        current: {
          value: current,
          unit: "A",
          threshold: {
            normal: { min: 8, max: 12 },
            warning: { min: 6, max: 14 },
            critical: { min: 0, max: 6 },
          },
        },
        temperature: {
          value: ambientTemperature,
          unit: "°C",
          threshold: {
            normal: { min: 20, max: 50 },
            warning: { min: 10, max: 60 },
            critical: { min: 0, max: 10 },
          },
        },
      });
    
      // Function to determine icon color based on thresholds
      const getIconColor = (value) => {
        if (value) {
          return colors.greenAccent[500]; // Normal range
        } else {
          return colors.redAccent[500];
        }
      };
      const getColorForDCV=(value)=>{
        if(value===0){
          return colors.blueAccent[500]
        }else if(value===1){
          return colors.greenAccent[500];
        }else{
          return colors.redAccent[500]
        }
      }
      return (
        <Box sx={{ p: 0 }}>
            <Grid container spacing={3}>
              {/* Battery State Paper */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={8} sx={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }} >
                      State of Charge
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <BatteryState
                        socValue={soc}
                        socState={socLN}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      Charger : {energy}kWh
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                    >
                      <img src={chargerIcon} style={{  width: "55px",height: "80px",}}/>
                     
                    </Box>
                  </Box>
                </Box>
                </Paper>
              </Grid>

              {/* AC Voltage Paper */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={8} sx={{ height: "150px",  display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      AC :<span>
                            <text 
                              x="150" 
                              y="25" 
                              textAnchor="middle" 
                              style={{ fill: theme.palette.primary.main }}
                            >
                              {voltages.ac.value}V / {voltages.ac.frequency}Hz /{voltages.ac.current}A
                            </text>
                          </span>
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        height: 100,
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <svg
                        style={{ width: "100%", height: "100%" }}
                        viewBox="0 0 300 100"
                        preserveAspectRatio="none"
                      >
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#ccc" strokeDasharray="4" />
                        <line x1="75" y1="0" x2="75" y2="100" stroke="#ccc" strokeDasharray="4" />
                        <line x1="150" y1="0" x2="150" y2="100" stroke="#ccc" strokeDasharray="4" />
                        <line x1="225" y1="0" x2="225" y2="100" stroke="#ccc" strokeDasharray="4" />
                        
                        {/* Animated sine wave */}
                        <polyline
                          points={createSineWave()}
                          fill="none"
                          stroke={getSineWaveColor()} 
                          strokeWidth="3"
                          style={{
                            animation: "translateWave 2s linear infinite"
                          }}
                        />
                      </svg>
                      
                      {/* Range indicators */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 0,
                          right: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          px: 2,
                          color: "text.secondary",
                          fontSize: "0.875rem"
                        }}
                      >
                        <span>220V</span>
                        <span>230V</span>
                        <span>240V</span>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* String Paper */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={8} sx={{ height: "150px",  display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      Instantaneous Data
                    </Typography>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                      {/* Voltage Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <PowerIcon
                            sx={{
                              fontSize: "2rem",
                              color: getColorForDCV(stringVoltageLHN)
                            }}
                          />
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {data.voltage.value} {data.voltage.unit}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Current Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <BoltIcon
                            sx={{
                              fontSize: "2rem",
                              color: getIconColor(stringCurrentHN)
                            }}
                          />
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {data.current.value} {data.current.unit}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Temperature Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <ThermostatIcon
                            sx={{
                              fontSize: "2rem",
                              color: getIconColor(ambientTemperatureHN)
                            }}
                          />
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {data.temperature.value} {data.temperature.unit}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              {/* Energy Paper */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={8} sx={{ height: "150px",  display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      Charger
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                    >
                      <BatteryFullIcon
                        sx={{
                          fontSize: "3rem",
                          color: colors.greenAccent[500]
                        }}
                      />
                      <Typography variant='h3'></Typography>
                      <Typography variant="h3" sx={{ mt: 1 }}>
                        {energy}kWh
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <style>
              {`
                @keyframes translateWave {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-75px);
                  }
                }
              `}
            </style>
        </Box>
      );
}

export default InstantNCharger