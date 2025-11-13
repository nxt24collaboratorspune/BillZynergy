import React from "react";
import {
  Box,
  Button,
  Card,
  Typography,
} from "@mui/material";

import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import "./css/reports.css";

const Reports: React.FC = () => {
  return (
    <Box className="report-root">
      <Box className="report-container">
        {/* Top header row */}
        <Box className="report-header-row">
          <Box>
            <Typography variant="h4" className="report-title">
              Reconciliation Report
            </Typography>
            <Typography variant="body1" className="report-subtitle">
              Detailed insights and AI-driven recommendations for your invoice reconciliation.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            className="report-download-btn"
            startIcon={<CloudDownloadOutlinedIcon />}
          >
            Download Full Report (PDF)
          </Button>
        </Box>

        {/* KPI section */}
        <Typography variant="subtitle1" className="report-section-heading">
          Key Performance Indicators
        </Typography>

        <Box className="report-kpi-row">
          <Card className="kpi-card" elevation={0}>
            <Box className="kpi-icon-wrap">
              <AssessmentOutlinedIcon className="kpi-icon" />
            </Box>
            <Typography className="kpi-title">Total Invoices Processed</Typography>
            <Typography className="kpi-value">5,234</Typography>
            <Typography className="kpi-caption">
              Across all reconciled batches.
            </Typography>
          </Card>

          <Card className="kpi-card" elevation={0}>
            <Box className="kpi-icon-wrap">
              <ErrorOutlineOutlinedIcon className="kpi-icon warning" />
            </Box>
            <Typography className="kpi-title">Total Discrepancies Found</Typography>
            <Typography className="kpi-value">187</Typography>
            <Typography className="kpi-caption">
              Requiring manual review.
            </Typography>
          </Card>

          <Card className="kpi-card" elevation={0}>
            <Box className="kpi-icon-wrap">
              <TrendingUpOutlinedIcon className="kpi-icon" />
            </Box>
            <Typography className="kpi-title">Average Discrepancy Rate</Typography>
            <Typography className="kpi-value">3.57%</Typography>
            <Typography className="kpi-caption">
              Compared to industry benchmarks.
            </Typography>
          </Card>

          <Card className="kpi-card" elevation={0}>
            <Box className="kpi-icon-wrap">
              <VerifiedUserOutlinedIcon className="kpi-icon success" />
            </Box>
            <Typography className="kpi-title">AI Accuracy Score</Typography>
            <Typography className="kpi-value">98.2%</Typography>
            <Typography className="kpi-caption">
              On first-pass reconciliation.
            </Typography>
          </Card>
        </Box>

        {/* Discrepancy analysis section */}
        <Typography variant="subtitle1" className="report-section-heading">
          Discrepancy Analysis
        </Typography>

        <Box className="report-analysis-row">
          {/* Left: donut breakdown */}
          <Card className="analysis-card" elevation={0}>
            <Typography className="analysis-title">
              Discrepancy Type Distribution
            </Typography>
            <Typography className="analysis-caption">
              Breakdown of reconciliation issues by category.
            </Typography>

            <Box className="donut-layout">
              <Box className="donut-chart" />

              <Box className="donut-legend">
                <div className="legend-row">
                  <span className="legend-dot orange" />
                  <span>Quantity Mismatch – 30%</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot teal" />
                  <span>Price Difference – 29%</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot blue" />
                  <span>Missing Item – 16%</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot yellow" />
                  <span>Date Discrepancy – 8%</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot green" />
                  <span>Service Code Error – 5%</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot rose" />
                  <span>Tax Calculation Error – 3%</span>
                </div>
              </Box>
            </Box>
          </Card>

          {/* Right: monthly trend */}
          <Card className="analysis-card" elevation={0}>
            <Typography className="analysis-title">
              Monthly Discrepancy Trend
            </Typography>
            <Typography className="analysis-caption">
              Historical view of reconciliation discrepancies.
            </Typography>

            <Box className="trend-chart">
              <Box className="trend-bar" style={{ height: "65%" }} />
              <Box className="trend-bar" style={{ height: "45%" }} />
              <Box className="trend-bar" style={{ height: "80%" }} />
              <Box className="trend-bar" style={{ height: "100%" }} />
              <Box className="trend-bar" style={{ height: "75%" }} />
              <Box className="trend-bar" style={{ height: "55%" }} />
            </Box>

            <Box className="trend-xlabels">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </Box>
          </Card>
        </Box>

        {/* AI recommendations */}
        <Typography variant="subtitle1" className="report-section-heading">
          AI Recommendations
        </Typography>

        <Card className="recommendations-card" elevation={0}>
          <Typography className="recommendations-title">
            Strategic Insights from BillZynergy AI
          </Typography>

          <Typography className="recommendations-text">
            The AI analysis indicates a recurring pattern of <strong>&quot;Quantity Mismatch&quot;</strong>{" "}
            discrepancies, particularly from Vendor ID #7890. We recommend a focused review of
            their recent invoice templates and a cross-check with purchase order fulfillment logs
            to identify process gaps.
          </Typography>

          <Typography className="recommendations-text">
            Additionally, the <strong>&quot;Price Difference&quot;</strong> issues are often linked to
            dynamic pricing agreements not being consistently updated in the procurement system.
            Consider automating price list synchronization with key suppliers or implementing a
            more robust change management protocol for price adjustments.
          </Typography>

          <Typography className="recommendations-text">
            For ongoing optimization, prioritize vendor education on standardized invoicing
            procedures and leverage BillZynergy&apos;s custom rule engine to flag subtle pricing
            variations proactively before they escalate into significant discrepancies.
          </Typography>
        </Card>

        {/* Bottom actions */}
        <Box className="report-footer-actions">
          <Button
            variant="outlined"
            size="medium"
            className="back-button"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
