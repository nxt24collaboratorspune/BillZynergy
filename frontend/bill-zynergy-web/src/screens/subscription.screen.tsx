import React from "react";
import { Box, Button, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const pricingStyles = {
  root: {
    maxWidth: 960,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 24,
  },
  packagesContainer: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
  },
  basicPackage: {
    backgroundColor: "#c6dcf7",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    textAlign: "center",
  },
  premiumPackage: {
    backgroundColor: "#f9f0d9",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    border: "1px solid #5c58cd",
    textAlign: "center",
  },
  priceText: {
    margin: "16px 0",
    fontWeight: "bold",
    fontSize: 36,
  },
  listIcon: {
    color: "#2e4566",
  },
  premiumPrice: {
    color: "#135e9b",
    fontWeight: "bold",
  },
  premiumImageContainer: {
    margin: "16px 0",
    position: "relative",
    height: 120,
    overflow: "hidden",
    borderRadius: 4,
  },
  premiumImage: {
    width: "100%",
    filter: "blur(2px)",
    userSelect: "none",
  },
  lockIconContainer: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "#888e99",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBasic: {
    marginTop: 24,
    width: "100%",
    padding: "12px 0",
    fontWeight: "bold",
  },
  buttonPremium: {
    backgroundColor: "#135e9b",
    color: "white",
    marginTop: 24,
    width: "100%",
    padding: "12px 0",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#2e4566",
    },
  },
};

const BasicPackage = () => (
  <Paper elevation={0} sx={pricingStyles.basicPackage}>
    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
      Basic Package
    </Typography>
    <Typography variant="body2" gutterBottom>
      Ideal for small businesses and startups just getting started with billing automation.
    </Typography>
    <Typography variant="h4" sx={pricingStyles.priceText}>
      $61 <Typography component="span" variant="body1">/month</Typography>
    </Typography>
    <List dense>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Up to 50 Invoices/month" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Basic Dashboard" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Email Support" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Client Management Portal" /></ListItem>
    </List>
    <Button variant="outlined" sx={pricingStyles.buttonBasic}>Start Basic</Button>
  </Paper>
);

const PremiumPackage = () => (
  <Paper elevation={0} sx={pricingStyles.premiumPackage}>
    <Typography variant="h6" component="h3" fontWeight="bold" color="#135e9b" gutterBottom>
      Premium Package
    </Typography>
    <Typography variant="body2" gutterBottom>
      Designed for growing businesses needing advanced features and priority support.
    </Typography>
    <Typography variant="h4" sx={{ ...pricingStyles.priceText, ...pricingStyles.premiumPrice }}>
      $111 <Typography component="span" variant="body1">/month</Typography>
    </Typography>
    <Box sx={pricingStyles.premiumImageContainer}>
      <img
        alt="Dashboard preview"
        src="/Final_Image.png"
        style={{
          width: '100%',
          filter: 'blur(2px)',
          userSelect: 'none' as const
        }}
      />
      <Box sx={pricingStyles.lockIconContainer}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20px" height="20px">
          <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1v-3a5 5 0 0 0-5-5zm3 8v-3a3 3 0 0 0-6 0v3z" />
        </svg>
      </Box>
    </Box>
    <List dense>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Unlimited Invoices" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Advanced PowerBI Dashboards" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Priority Chat & Phone Support" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Advance Features" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Automated Payment Reminders" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Multi-currency Billing" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="API access & Integrations" /></ListItem>
      <ListItem><ListItemIcon sx={pricingStyles.listIcon}><CheckCircleOutlineIcon /></ListItemIcon><ListItemText primary="Customization" /></ListItem>
    </List>
    <Button variant="contained" sx={pricingStyles.buttonPremium}>Go Premium</Button>
  </Paper>
);

const Subscription = () => {
  return (
    <Box sx={pricingStyles.root}>
      <header style={pricingStyles.header}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Simple Pricing, Powerful Billing
        </Typography>
        <Typography variant="body1" color="textSecondary" maxWidth={600} mx="auto">
          Choose the perfect plan for your business needs. Seamlessly manage invoices, payments, and client relationships with Billzynergy.
        </Typography>
      </header>
      <Box sx={pricingStyles.packagesContainer}>
        <BasicPackage />
        <PremiumPackage />
      </Box>
    </Box>
  );
}

export default Subscription