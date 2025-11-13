import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import "./css/dashboard.css";

type Status = "Reconciled" | "Discrepancy" | "Pending";

interface InvoiceRow {
    id: string;
    vendor: string;
    amount: string;
    date: string;
    status: Status;
    fileUrl?: string;
}

const invoiceData: InvoiceRow[] = [
    {
        id: "INV-2023-001",
        vendor: "Tech Solutions Inc.",
        amount: "$1,250.00",
        date: "2023-11-15",
        status: "Reconciled",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
        id: "INV-2023-002",
        vendor: "Global Supply Co.",
        amount: "$780.50",
        date: "2023-11-18",
        status: "Discrepancy",
        fileUrl: "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
    },
    {
        id: "INV-2023-003",
        vendor: "Creative Marketing Ltd.",
        amount: "$3,500.00",
        date: "2023-11-20",
        status: "Pending",
        fileUrl: "https://people.sc.fsu.edu/~jburkardt/data/csv/biostats.csv"
    },
    {
        id: "INV-2023-004",
        vendor: "Data Insights Corp.",
        amount: "$99.99",
        date: "2023-11-22",
        status: "Reconciled",
    },
    {
        id: "INV-2023-005",
        vendor: "Office Supplies Inc.",
        amount: "$45.75",
        date: "2023-11-25",
        status: "Discrepancy",
    },
    {
        id: "INV-2023-006",
        vendor: "Transport Logistics LLC",
        amount: "$560.00",
        date: "2023-11-28",
        status: "Reconciled",
    },
    {
        id: "INV-2023-007",
        vendor: "IT Hardware Solutions",
        amount: "$2,100.00",
        date: "2023-12-01",
        status: "Pending",
    },
];

const Dashboard: React.FC = () => {
    // const [previewOpen, setPreviewOpen] = useState(false);
    // const [previewInvoice, setPreviewInvoice] = useState<InvoiceRow | null>(null);
    const [statusFilter, setStatusFilter] = React.useState("All");
    const [vendorFilter, setVendorFilter] = React.useState("All");
    const [searchText, setSearchText] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    // const handlePreview = (row: InvoiceRow) => {
    //     setPreviewInvoice(row);
    //     setPreviewOpen(true);
    // };

    const filteredInvoices = invoiceData.filter((row) => {
        // Status Filter
        if (statusFilter !== "All" && row.status !== statusFilter) return false;

        // Vendor Filter
        if (vendorFilter !== "All" && row.vendor !== vendorFilter) return false;

        // Search Filter: invoice#, vendor
        const text = searchText.toLowerCase();
        if (
            text &&
            !row.id.toLowerCase().includes(text) &&
            !row.vendor.toLowerCase().includes(text)
        ) {
            return false;
        }

        return true;
    });


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
                                <Typography className="summary-card-title">
                                    Total Invoices
                                </Typography>
                                <ReceiptLongOutlinedIcon className="summary-card-icon" />
                            </Box>
                            <Typography className="summary-card-value">7</Typography>
                            <Typography className="summary-card-caption">
                                Processed this period
                            </Typography>
                        </Card>
                    </Box>

                    {/* Discrepancies */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">
                                    Discrepancies
                                </Typography>
                                <ReportGmailerrorredOutlinedIcon className="summary-card-icon warning" />
                            </Box>
                            <Typography className="summary-card-value">2</Typography>
                            <Typography className="summary-card-caption">
                                Requiring attention
                            </Typography>
                        </Card>
                    </Box>

                    {/* Pending Review */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">
                                    Pending Review
                                </Typography>
                                <AccessTimeOutlinedIcon className="summary-card-icon" />
                            </Box>
                            <Typography className="summary-card-value">2</Typography>
                            <Typography className="summary-card-caption">
                                Awaiting approval
                            </Typography>
                        </Card>
                    </Box>

                    {/* Reconciled */}
                    <Box className="summary-item">
                        <Card className="summary-card" elevation={0}>
                            <Box className="summary-card-header">
                                <Typography className="summary-card-title">
                                    Reconciled
                                </Typography>
                                <CheckCircleOutlineOutlinedIcon className="summary-card-icon success" />
                            </Box>
                            <Typography className="summary-card-value">3</Typography>
                            <Typography className="summary-card-caption">
                                Successfully matched
                            </Typography>
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
                            {invoiceData.map((i) => (
                                <option key={i.vendor} value={i.vendor}>
                                    {i.vendor}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Box>


                {/* Details table card */}
                <Card className="details-card" elevation={0}>
                    <Box className="details-card-header">
                        <Typography className="details-title">
                            Reconciliation Details
                        </Typography>
                    </Box>

                    {/* Table header */}
                    <Box className="details-table-header">
                        <Typography className="details-header-cell">Invoice #</Typography>
                        <Typography className="details-header-cell">Vendor</Typography>
                        <Typography className="details-header-cell right">
                            Amount
                        </Typography>
                        <Typography className="details-header-cell right">
                            Date
                        </Typography>
                        <Typography className="details-header-cell right">
                            Status
                        </Typography>
                        <Typography className="details-header-cell right">Preview</Typography>
                    </Box>

                    {/* Table rows */}
                    {filteredInvoices.map((row) => (
                        <Box key={row.id} className="details-table-row">
                            <Typography className="details-cell">{row.id}</Typography>
                            <Typography className="details-cell">{row.vendor}</Typography>
                            <Typography className="details-cell right">
                                {row.amount}
                            </Typography>
                            <Typography className="details-cell right">
                                {row.date}
                            </Typography>
                            <Box className="details-cell right">
                                <Chip
                                    size="small"
                                    label={row.status}
                                    className={`status-chip status-${row.status.toLowerCase()}`}
                                />
                            </Box>
                            <Box className="details-cell right">
                                <IconButton
                                    onClick={() => handleOpenInvoice(row)}
                                    className="preview-icon-btn"
                                    size="small"
                                >
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
