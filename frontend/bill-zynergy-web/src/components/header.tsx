import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "./css/header.css";
import { paths } from "../helper";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  return (
    <AppBar position="static" elevation={0} className="header-root">
      <Toolbar className="header-toolbar">
        {/* Logo */}
        <Box className="header-logo">
          <Box className="logo-icon">
            <img src="/billZynergy_logo.png" alt="BillZynergy Logo" className="logo-img" />
          </Box>
          <Typography variant="h3" className="logo-text">
            BillZynergy
          </Typography>
        </Box>

        {/* Navigation */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            startIcon={<HomeOutlinedIcon fontSize="small" />}
            className={`nav-link ${isActive(paths?.welcome) ? "nav-active" : ""}`}
            onClick={() => navigate(paths?.welcome)}
          >
            Welcome
          </Button>

          <Button
            startIcon={<UploadFileOutlinedIcon fontSize="small" />}
            className={`nav-link ${isActive(paths?.upload) ? "nav-active" : ""}`}
            onClick={() => navigate(paths?.upload)}
          >
            Upload
          </Button>

          <Button
            startIcon={<DashboardOutlinedIcon fontSize="small" />}
            className={`nav-link ${isActive(paths?.dashboard) ? "nav-active" : ""}`}
            onClick={() => navigate(paths?.dashboard)}
          >
            Dashboard
          </Button>

          <Button
            startIcon={<DescriptionOutlinedIcon fontSize="small" />}
            className={`nav-link ${isActive(paths?.subscription) ? "nav-active" : ""}`}
            onClick={() => navigate(paths?.subscription)}
          >
            Subscription Plans
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
