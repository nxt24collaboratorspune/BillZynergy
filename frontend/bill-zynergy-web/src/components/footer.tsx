import React from "react";
import { Box, Typography } from "@mui/material";
import "./css/footer.css";

const Footer = () => {
  return (
    <Box className="footer-root">
      <Box className="footer-inner">
        <Typography variant="body2" className="footer-text">
          © 2025 BillZynergy. All rights reserved.
        </Typography>

        <Typography variant="body2" className="footer-text">
          Built for Agentic AI Hackathon 2025, Dentsu
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
