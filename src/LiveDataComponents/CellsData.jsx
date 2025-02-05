import React, { useState } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import Pictorial from "./CellsGraph/Pictorial";
import LineGraph from "./CellsGraph/LineGraph";
import CellTable from "./CellsGraph/CellTable";
import FullCellLayout from "./CellsGraph/Fullcelllayout"; // Import the FullCellLayout component
import { tokens } from "../theme";

const CellsData = ({ data, siteId, serialNumber, bmsalarms }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activeView, setActiveView] = useState("Pictorial");
  const [isFullscreen, setIsFullscreen] = useState(false); // State to manage fullscreen mode
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

  const viewComponents = {
    Pictorial: (
      <Pictorial
        cellDataList={data}
        serialNumber={serialNumber}
        siteId={siteId}
        chargingStatus={bmsalarms.bankCycleDC}
      />
    ),
    Graphical: <LineGraph data={data} />,
    Tabular: <CellTable data={data} />,
  };

  const toggleFullscreen = () => {
    setIsDialogOpen(true); // Open the dialog when fullscreen icon is clicked
  };

  const closeDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Box
      sx={{
        
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Topbar */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        gap="8px"
        border={`1px solid ${colors.greenAccent[500]}`}
        borderRadius="4px"
        padding="6px"
        sx={{
         // backgroundColor: colors.primary[500],
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {["Pictorial", "Graphical", "Tabular"].map((text, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => setActiveView(text)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                color: colors.primary[900],
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color:
                  activeView === text
                    ? colors.greenAccent[500]
                    : colors.grey[300],
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}

        {/* Fullscreen Button */}
        <IconButton color="secondary" sx={{ ml: 2 }} onClick={toggleFullscreen}>
          <FullscreenIcon />
        </IconButton>
      </Box>

      {/* Dynamic Component Rendering */}
      <Box mt={2}>{viewComponents[activeView]}</Box>

      {/* Fullscreen Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg" fullWidth>
        {/* Close Button at the top-right */}
        <IconButton
          onClick={closeDialog}
          color="secondary"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: colors.redAccent[500],
            borderRadius: "50%",
            padding: "4px", // Reduce padding for smaller button
            "&:hover": {
              backgroundColor: colors.redAccent[700],
            },
            transition: "background-color 0.3s ease",
          }}
        >
          <CloseIcon sx={{ color: "white", fontSize: "1.2rem" }} /> {/* Reduced size */}
        </IconButton>

        {/* <DialogTitle sx={{ textAlign: 'center' }}>Full Cell Layout</DialogTitle> */}
        <DialogContent>
          <FullCellLayout
            cellDataList={data}
            serialNumber={serialNumber}
            siteId={siteId}
            chargingStatus={bmsalarms.bankCycleDC}
          />
        </DialogContent>
        <DialogActions>
          {/* The Close button here is already handled in the top-right corner */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CellsData;
