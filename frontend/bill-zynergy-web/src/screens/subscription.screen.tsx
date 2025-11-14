import React from "react";
import { Box, Button, Card, Typography, Checkbox } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./css/subscription.css";

const Subscription: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        padding: "40px 0",
        backgroundColor: "#F5F7FB", // light background
      }}
    >
      {/* Basic Package */}
      <Card className="pricing-card" elevation={6}>
        <Box className="pricing-header">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Basic Package
          </Typography>
          <Typography variant="body2" sx={{ color: "#5C6BC0", marginTop: 1 }}>
            Ideal for small businesses and startups just getting started with billing automation.
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ marginTop: 3 }}>
          $61 <span style={{ fontSize: "1rem" }}>/month</span>
        </Typography>

        <Box className="pricing-feature-list">
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Up to 50 Invoices/month
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Basic Dashboard
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Email Support
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Client Management Portal
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 4,
            backgroundColor: "#5C6BC0",
            textTransform: "none",
            padding: "10px 0",
          }}
        >
          Start Basic
        </Button>
      </Card>

      {/* Premium Package */}
      <Card className="pricing-card premium" elevation={6}>
        <Box className="pricing-header">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Premium Package
          </Typography>
          <Typography variant="body2" sx={{ color: "#5C6BC0", marginTop: 1 }}>
            Designed for growing businesses needing advanced features and priority support.
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ marginTop: 3 }}>
          $111 <span style={{ fontSize: "1rem" }}>/month</span>
        </Typography>

        <Box className="pricing-feature-list">
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Unlimited Invoices
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Advanced PowerBI Dashboards
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Priority Chat & Phone Support
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Advanced Features
            </Typography>
          </Box>
          <Box>
            <Checkbox
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 16, color: "#5C6BC0" }} />}
              checked
            />
            <Typography variant="body2" sx={{ display: "inline-block" }}>
              Automated Payment Reminders
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 4,
            backgroundColor: "#5C6BC0",
            textTransform: "none",
            padding: "10px 0",
          }}
        >
          Go Premium
        </Button>
      </Card>
    </Box>
  );
};

export default Subscription;
