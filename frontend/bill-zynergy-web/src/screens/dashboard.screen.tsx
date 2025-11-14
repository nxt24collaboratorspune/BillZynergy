import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";

import "./css/dashboard.css";

type Status = "Reconciled" | "Discrepancy" | "Pending";

interface InvoiceRow {
    Invoice_No?: string;
    Client_Name?: string;
    Vendor?: string;
    Campaign_Id?: string;
    Billed_Cost?: string;
    Ad_Cost?: string;
    Media_budget?: string;
    Reconcilation_Amount?: string
    status?: Status;
    fileUrl?: string;
}

const Dashboard: React.FC = () => {
    const [invoiceData, setInvoiceData] = useState<InvoiceRow[]>([
        {
            Invoice_No: "INV-2023-001",
            Client_Name: "Tech Solutions Inc.",
            Vendor: "Tech Vendor A",
            Campaign_Id: "CP-12345",
            Billed_Cost: "$1,250.00",
            Ad_Cost: "$800.00",
            Reconcilation_Amount: "$1,000.00",
            status: "Reconciled",
            fileUrl: "https://example.com/invoice/INV-2023-001.pdf",
        },
        {
            Invoice_No: "INV-2023-002",
            Client_Name: "Global Supply Co.",
            Vendor: "Global Vendor B",
            Campaign_Id: "CP-12346",
            Billed_Cost: "$780.50",
            Ad_Cost: "$400.00",
            Reconcilation_Amount: "$650.50",
            status: "Discrepancy",
            fileUrl: "https://example.com/invoice/INV-2023-002.pdf",
        },
        {
            Invoice_No: "INV-2023-003",
            Client_Name: "Creative Marketing Ltd.",
            Vendor: "Creative Vendor C",
            Campaign_Id: "CP-12347",
            Billed_Cost: "$3,500.00",
            Ad_Cost: "$2,000.00",
            Reconcilation_Amount: "$3,200.00",
            status: "Pending",
            fileUrl: "https://example.com/invoice/INV-2023-003.pdf",
        },
        {
            Invoice_No: "INV-2023-004",
            Client_Name: "Data Insights Corp.",
            Vendor: "Data Vendor D",
            Campaign_Id: "CP-12348",
            Billed_Cost: "$99.99",
            Ad_Cost: "$50.00",
            Reconcilation_Amount: "$99.99",
            status: "Reconciled",
            fileUrl: "https://example.com/invoice/INV-2023-004.pdf",
        },
        {
            Invoice_No: "INV-2023-005",
            Client_Name: "Office Supplies Inc.",
            Vendor: "Office Vendor E",
            Campaign_Id: "CP-12349",
            Billed_Cost: "$45.75",
            Ad_Cost: "$20.00",
            Reconcilation_Amount: "$45.75",
            status: "Discrepancy",
            fileUrl: "https://example.com/invoice/INV-2023-005.pdf",
        },
        {
            Invoice_No: "INV-2023-006",
            Client_Name: "Transport Logistics LLC",
            Vendor: "Transport Vendor F",
            Campaign_Id: "CP-12350",
            Billed_Cost: "$560.00",
            Ad_Cost: "$300.00",
            Reconcilation_Amount: "$500.00",
            status: "Reconciled",
            fileUrl: "https://example.com/invoice/INV-2023-006.pdf",
        },
        {
            Invoice_No: "INV-2023-007",
            Client_Name: "IT Hardware Solutions",
            Vendor: "IT Vendor G",
            Campaign_Id: "CP-12351",
            Billed_Cost: "$2,100.00",
            Ad_Cost: "$1,200.00",
            Reconcilation_Amount: "$1,950.00",
            status: "Pending",
            fileUrl: "https://example.com/invoice/INV-2023-007.pdf",
        },
        {
            Invoice_No: "INV-2023-008",
            Client_Name: "Marketing Pro Ltd.",
            Vendor: "Marketing Vendor H",
            Campaign_Id: "CP-12352",
            Billed_Cost: "$980.00",
            Ad_Cost: "$500.00",
            Reconcilation_Amount: "$900.00",
            status: "Reconciled",
            fileUrl: "https://example.com/invoice/INV-2023-008.pdf",
        },
        {
            Invoice_No: "INV-2023-009",
            Client_Name: "Tech Enterprises",
            Vendor: "Tech Vendor I",
            Campaign_Id: "CP-12353",
            Billed_Cost: "$2,600.00",
            Ad_Cost: "$1,400.00",
            Reconcilation_Amount: "$2,500.00",
            status: "Discrepancy",
            fileUrl: "https://example.com/invoice/INV-2023-009.pdf",
        },
        {
            Invoice_No: "INV-2023-010",
            Client_Name: "Office Supplies Co.",
            Vendor: "Office Vendor J",
            Campaign_Id: "CP-12354",
            Billed_Cost: "$850.00",
            Ad_Cost: "$400.00",
            Reconcilation_Amount: "$800.00",
            status: "Pending",
            fileUrl: "https://example.com/invoice/INV-2023-010.pdf",
        },
    ]);

    const [statusFilter, setStatusFilter] = useState("All");
    const [vendorFilter, setVendorFilter] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    // Filter invoice data based on search text, status, and vendor
    const filteredInvoices = invoiceData.filter((row) => {
        // Status Filter
        if (statusFilter !== "All" && row.status !== statusFilter) return false;

        // Vendor Filter
        if (vendorFilter !== "All" && row.Vendor !== vendorFilter) return false;

        // Search Filter: invoice#, vendor
        const text = searchText.toLowerCase();
        if (
            text &&
            !row?.Invoice_No?.toLowerCase().includes(text) &&
            !row?.Vendor?.toLowerCase().includes(text)
        ) {
            return false;
        }

        return true;
    });

    // Function to handle invoice preview
    const handleOpenInvoice = (row: InvoiceRow) => {
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
                            <Typography className="summary-card-value">{invoiceData.length}</Typography>
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
                            <Typography className="summary-card-value">{filteredInvoices.filter(i => i.status === "Discrepancy").length}</Typography>
                            <Typography className="summary-card-caption">Requiring attention</Typography>
                        </Card>
                    </Box>

                    {/* Pending Review */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">Pending Review</Typography>
                                <AccessTimeOutlinedIcon className="summary-card-icon" />
                            </Box>
                            <Typography className="summary-card-value">{filteredInvoices.filter(i => i.status === "Pending").length}</Typography>
                            <Typography className="summary-card-caption">Awaiting approval</Typography>
                        </Card>
                    </Box>

                    {/* Reconciled */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">Reconciled</Typography>
                                <CheckIcon className="summary-card-icon success" />
                            </Box>
                            <Typography className="summary-card-value">{filteredInvoices.filter(i => i.status === "Reconciled").length}</Typography>
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
                            <option value="Pending">Pending</option>
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
                            {/* Add Vendor options dynamically */}
                            {invoiceData.map((i) => (
                                <option key={i.Vendor} value={i.Vendor}>
                                    {i.Vendor}
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
                        <Typography className="details-header-cell right">Reconcilation Amount</Typography>
                        <Typography className="details-header-cell right">Status</Typography>
                        <Typography className="details-header-cell right">Preview</Typography>
                    </Box>

                    {/* Table rows */}
                    {filteredInvoices.map((row) => (
                        <Box key={row.Invoice_No} className="details-table-row">
                            <Typography className="details-cell">{row.Invoice_No}</Typography>
                            <Typography className="details-cell">{row.Client_Name}</Typography>
                            <Typography className="details-cell">{row.Vendor}</Typography>
                            <Typography className="details-cell">{row.Campaign_Id}</Typography>
                            <Typography className="details-cell right">{row.Billed_Cost}</Typography>
                            <Typography className="details-cell right">{row.Ad_Cost}</Typography>
                            <Typography className="details-cell right">{row.Reconcilation_Amount}</Typography>
                            <Box className="details-cell right">
                                <Chip size="small" label={row.status} className={`status-chip status-${row?.status?.toLowerCase()}`} />
                            </Box>
                            <Box className="details-cell right">
                                <IconButton onClick={() => handleOpenInvoice(row)} className="preview-icon-btn" size="small">
                                    <VisibilityOutlinedIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
