import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import logo from '../../assets/images/png/vajra.png';
import profilePic from '../../assets/images/png/maha.png';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const handleItemClick = () => {
    setSelected(title);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? "#fff" : "#000000", // Text color white when selected
        backgroundColor: selected === title ? "#e3e3e3" : "transparent", // Background color for selected item
      }}
      onClick={handleItemClick} // Trigger the click handler
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: 1 }} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          width: isCollapsed ? "80px" : "230px", 
          minWidth: isCollapsed ? "80px" : "230px",
          transition: "width 0.3s ease",
        },
        "& .pro-sidebar-inner": {
          background: "#ffffff !important",
          transition: "all 0.3s ease",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "#000000 !important",
        },
        "& .pro-inner-item:hover": {
          color: "#f44336 !important",
        },
        "& .pro-menu-item.active": {
          color: "#f44336 !important",
        },
        "& .pro-menu > ul > .pro-menu-item > .pro-inner-item": {
          color: "#000000 !important",
        },
        
        height: "100%",
        
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img src={logo} alt="Logo" style={{ height: "35px", objectFit: "contain",marginLeft:"-20px", }} />

                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>


          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
              <img
              src={profilePic}
              alt="profile-user"
              width="100px"
              height="100px"
              style={{
                cursor: "pointer",
                borderRadius: "50%",  // Makes the image circular
                objectFit: "contain", // Ensures the whole image fits without cropping
                border: "0.5px solid #d82b27", // Adds a black border around the image
              }}
            />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color="#000000"
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                 VAJRA
                </Typography>
                <Typography variant="h5" color="#f44336">
                 USER
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Live Monitoring"
              to="/livemonitoring"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              title="Analytics"
              icon={<PieChartOutlineOutlinedIcon />}
              style={{ color: "#000000" }}
            >
              <Item
                title="Historical"
                to="/historical"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Alarm"
                to="/alarms"
                icon={<AlarmOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="DayWise"
                to="/daywise"
                icon={<EventOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Monthly"
                to="/monthly"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="Site Details"
              to="/siteDetails"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
            <Item
              title="Issue Tracking"
              to="/issuetracking"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
