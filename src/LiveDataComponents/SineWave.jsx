import React from 'react';
import { Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';
import { ColorModeContext, tokens } from "../theme";
const VoltageVisualizations = () => {
  const theme = useTheme(); // Get theme for colors
  const colors = tokens(theme.palette.mode);
  
  const [voltages, setVoltages] = React.useState({
    ac: {
      value: 230,
      min: 220,
      max: 240,
      frequency: 50,
      current: 10
    },
  
  });

  // Calculate colors based on voltage levels
  

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
  

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
  {/* AC Voltage Card */}
  <Grid item xs={6} md={3}>  {/* Decreased size further */}
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{fontWeight:'bold'}}>
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
            position: 'relative',
            height: 100,
            bgcolor: 'grey.100',
            borderRadius: 2,
            p: 2
          }}
        >
          <svg
            style={{ width: '100%', height: '100%' }}
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
              stroke={colors.blueAccent[500]} // Corrected stroke color
              strokeWidth="3"
              style={{
                animation: 'translateWave 2s linear infinite'
              }}
            />
          </svg>
          
          {/* Range indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              px: 2,
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            <span>{voltages.ac.min}V</span>
            <span>{voltages.ac.value}V</span>
            <span>{voltages.ac.max}V</span>
          </Box>
        </Box>
      </CardContent>
    </Card>
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
</Grid>

  
  );
};

export default VoltageVisualizations;