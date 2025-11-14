import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
    CircularProgress,
    IconButton
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CircularProgress as LoadingSpinner } from "@mui/material";

import "./css/dashboard.css";

type HasDiscrepancy = "No Discrepancy" | "Discrepancy";

interface InvoiceRow {
    counts?: number;
    discrepancy_count?: number;
    reconcilation_count?: number;
    records?: Records[];
}

interface Records {
    Invoice_No?: string;
    Client_Name?: string;
    Vendor?: string;
    Campaign_Id?: string;
    Billed_Cost?: string;
    Ad_Cost?: string;
    Media_budget?: string;
    Reconcilation_Amount?: string;
    Has_Discrepancy?: HasDiscrepancy;
    fileUrl?: string;
}

const Dashboard: React.FC = () => {
    const [invoiceData, setInvoiceData] = useState<InvoiceRow>({});
    const [statusFilter, setStatusFilter] = useState("All");
    const [vendorFilter, setVendorFilter] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);  // Set loading state to true initially

    // Fetch invoices from API when the component mounts
    useEffect(() => {
        const fetchInvoiceData = async () => {
            setLoading(true);
            try {
                // Replace this with your actual API endpoint
                const response = await fetch("https://app-billzynergy-backend-dev.azurewebsites.net/show_discrepency_tbl");
                if (response.ok) {
                    const data = await response.json();
                    setInvoiceData(data);  // Set the fetched invoice data
                } else {
                    console.error("Failed to fetch invoice data");
                }
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            } finally {
                setLoading(false);  // Set loading to false once data is fetched
            }
        };

        fetchInvoiceData();
    }, []);

    const filteredInvoices = invoiceData?.records?.filter((row) => {
        const status = row?.Has_Discrepancy === "No Discrepancy" ? "Reconciled" : "Discrepancy"
        // Status Filter
        if (statusFilter !== "All" && status !== statusFilter) return false;

        // Vendor Filter
        if (vendorFilter !== "All" && row.Vendor !== vendorFilter) return false;

        // Search Filter: invoice#, vendor
        const text = searchText.toLowerCase();
        if (
            text &&
            !row?.Invoice_No?.toString().includes(text) &&
            !row?.Vendor?.toLowerCase().includes(text)
        ) {
            return false;
        }

        return true;
    });

    const handleOpenInvoice = (row: Records) => {
        if (!row.fileUrl) {
            alert("No file available for this invoice yet.");
            return;
        }
        window.open(row.fileUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Box className="dashboard-root">
            <Box className="dashboard-container">
                {/* Title */}
                <Typography variant="h4" className="dashboard-title">
                    Reconciliation Dashboard
                </Typography>

                {/* Summary cards row */}
                <Box className="dashboard-summary-row">
                    {/* Total Invoices */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">Total Invoices</Typography>
                                <ReceiptLongOutlinedIcon className="summary-card-icon" />
                            </Box>
                            <Typography className="summary-card-value">{invoiceData?.counts}</Typography>
                            <Typography className="summary-card-caption">Processed this period</Typography>
                        </Card>
                    </Box>

                    {/* Discrepancies */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">Discrepancies</Typography>
                                <ReportGmailerrorredOutlinedIcon className="summary-card-icon warning" />
                            </Box>
                            <Typography className="summary-card-value">{filteredInvoices?.filter(i => i.Has_Discrepancy === "Discrepancy").length}</Typography>
                            <Typography className="summary-card-caption">Requiring attention</Typography>
                        </Card>
                    </Box>

                    {/* Reconciled */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">Reconciled</Typography>
                                <CheckIcon className="summary-card-icon success" />
                            </Box>
                            <Typography className="summary-card-value">{filteredInvoices?.filter(i => i.Has_Discrepancy === "No Discrepancy").length}</Typography>
                            <Typography className="summary-card-caption">Successfully matched</Typography>
                        </Card>
                    </Box>
                </Box>

                {/* Filters Row */}
                <Box className="filters-row">
                    {/* Search */}
                    <Box>
                        <input
                            type="text"
                            placeholder="Search Invoice or Vendor..."
                            className="filter-input"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>

                    {/* Status Filter */}
                    <Box>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Reconciled">Reconciled</option>
                            <option value="Discrepancy">Discrepancy</option>
                        </select>
                    </Box>

                    {/* Vendor Filter */}
                    <Box>
                        <select
                            className="filter-select"
                            value={vendorFilter}
                            onChange={(e) => setVendorFilter(e.target.value)}
                        >
                            <option value="All">All Vendors</option>
                            {Array.from(
                                new Set(filteredInvoices?.map((i) => i.Vendor))
                            ).map((vendor) => (
                                <option key={vendor} value={vendor}>
                                    {vendor}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Box>

                {/* Details table card */}
                <Card className="details-card" elevation={0}>
                    <Box className="details-card-header">
                        <Typography className="details-title">Reconciliation Details</Typography>
                    </Box>

                    {/* Table header */}
                    <Box className="details-table-header">
                        <Typography className="details-header-cell">Invoice No</Typography>
                        <Typography className="details-header-cell">Client Name</Typography>
                        <Typography className="details-header-cell">Vendor</Typography>
                        <Typography className="details-header-cell">Campaign Id</Typography>
                        <Typography className="details-header-cell right">Billed Cost</Typography>
                        <Typography className="details-header-cell right">Ad Cost</Typography>
                        <Typography className="details-header-cell right">Media_budget</Typography>
                        <Typography className="details-header-cell right">Reconcilation Amount</Typography>
                        <Typography className="details-header-cell right">Status</Typography>
                        <Typography className="details-header-cell right">Preview</Typography>
                    </Box>

                    {/* Table rows */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        filteredInvoices?.map((row) => {
                            const status = row?.Has_Discrepancy === "No Discrepancy" ? "Reconciled" : "Discrepancy"

                            return (<Box key={row.Invoice_No} className="details-table-row">
                                <Typography className="details-cell">{row.Invoice_No}</Typography>
                                <Typography className="details-cell">{row.Client_Name}</Typography>
                                <Typography className="details-cell">{row.Vendor}</Typography>
                                <Typography className="details-cell">{row.Campaign_Id}</Typography>
                                <Typography className="details-cell right">{row.Billed_Cost}</Typography>
                                <Typography className="details-cell right">{row.Ad_Cost}</Typography>
                                <Typography className="details-cell right">{row.Media_budget}</Typography>
                                <Typography className="details-cell right">{row.Reconcilation_Amount}</Typography>
                                <Box className="details-cell right">
                                    <Chip size="small" label={status} className={`status-chip status-${status?.toLowerCase()}`} />
                                </Box>
                                <Box className="details-cell right">
                                    <IconButton onClick={() => handleOpenInvoice(row)} className="preview-icon-btn" size="small">
                                        <VisibilityOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </Box>)
                        })
                    )}
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
