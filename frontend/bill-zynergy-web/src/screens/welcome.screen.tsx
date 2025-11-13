import React from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "./css/welcome.css";
import { useNavigate } from "react-router-dom";
import { paths } from "../helper";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Box className="welcome-root">
      <Box className="welcome-container">
        <Typography
          variant="h3"
          className="welcome-title"
        >
          BillZynergy
        </Typography>

        <Typography
          variant="subtitle1"
          className="welcome-subtitle"
        >
          Effortless Invoice Reconciliation with AI Precision
        </Typography>

        {/* Video Card */}
        <Box className="welcome-media-container">
          <Card elevation={0} className="welcome-video-card">
            <video
              className="welcome-video"
              src="/welcome_video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </Card>

          <Button
            variant="contained"
            size="large"
            className="welcome-upload-btn"
            onClick={() => navigate(paths?.upload)}
          >
            Upload Invoice
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
