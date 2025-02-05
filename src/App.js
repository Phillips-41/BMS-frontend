import { useState, useContext, useEffect } from "react";
import Footer from "./components/Footer/Footer";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/Dashboard/index.jsx";
import LoginPage from "../src/components/LoginPage/index.jsx";
import Header from "./components/Header/Header";
import Livemonitoring from "./scenes/Livemonitoring/livemonitoring.jsx";
import Historical from "./scenes/Analytics/Historical/index.jsx";
import Alarms from "./scenes/Analytics/Alarms/index.jsx";
import Daywise from "./scenes/Analytics/Daywise/index.jsx";
import Monthly from "./scenes/Analytics/Monthly/index.jsx";
import SiteDetails from "./scenes/Preferences/SiteDetails/index.jsx";
// import VendorInfo from "./scenes/Preferences/VendorInfo/index.jsx";
import IssueTracking from "./scenes/Issuetracking/index.jsx";
// import Events from "./scenes/Events/index.jsx";
import { CssBaseline, ThemeProvider, IconButton } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Users from "./scenes/Users/index.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AppContext } from "./services/AppContext.js";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

// Auto-refresh hook

const AuthenticatedLayout = ({ isSidebar, setIsSidebar, handleLogout }) => {
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Header />
        {/* Logout Icon Button */}
        <IconButton
      onClick={handleLogout}
      sx={{
        position: 'absolute',
        top: '25px',
        right: '10px',
        color: '#fff', // Set the icon color to white
        '& svg': {
          fontWeight: 'bold', // Make the icon bold
        },
      }}
    >
      <PowerSettingsNewIcon />
    </IconButton>
        <Outlet /> {/* Renders the nested routes */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage onLogin={handleLogin} />,
    },
    {
      path: "/",
      element: isAuthenticated ? (
        <AuthenticatedLayout 
          isSidebar={isSidebar} 
          setIsSidebar={setIsSidebar} 
          handleLogout={handleLogout} 
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      ),
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/livemonitoring", element: <Livemonitoring /> },
        { path: "/historical", element: <Historical /> },
        { path: "/alarms", element: <Alarms /> },
        { path: "/daywise", element: <Daywise /> },
        { path: "/monthly", element: <Monthly /> },
        { path: "/siteDetails", element: <SiteDetails /> },
    
        { path: "/issuetracking", element: <IssueTracking /> },
      
        { path: "/users", element: <Users /> },
      ],
    },
  ]);



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
