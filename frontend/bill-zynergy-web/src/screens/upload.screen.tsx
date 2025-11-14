import React, {
  useRef,
  useState,
  ChangeEvent,
  DragEvent,
  FC,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import * as XLSX from "xlsx";

import "./css/upload.css";
import { paths } from "../helper";

// 4 pipeline calls AFTER upload (adapt URLs as needed)
const pipelineUrls = [
  "https://app-billzynergy-backend-dev.azurewebsites.net/extract-file",
  "https://app-billzynergy-backend-dev.azurewebsites.net/matching",
  "https://app-billzynergy-backend-dev.azurewebsites.net/descripency",
  // "https://app-billzynergy-backend-dev.azurewebsites.net/explanation-report",
];

// 4 visual steps
const steps = [
  {
    id: 1,
    title: "Injection",
    // subtitle: "Select and upload your invoices.",
  },
  {
    id: 2,
    title: "Matching",
    // subtitle: "AI processes and extracts data.",
  },
  {
    id: 3,
    title: "Discrepancy",
    // subtitle: "Verify and reconcile invoices.",
  },
  {
    id: 4,
    title: "Insight",
    // subtitle: "Invoice processing is finalized.",
  },
  {
    id: 5,
    title: "Audit Trail",
    // subtitle: "Invoice processing is finalized.",
  },
];

const Upload: FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // previews
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // image/pdf
  const [textPreview, setTextPreview] = useState<string | null>(null); // txt
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null); // csv
  const [xlsxPreview, setXlsxPreview] = useState<string[][] | null>(null); // xlsx
  const [insightDownloadUrl, setInsightDownloadUrl] = useState<string | null>(null);

  const INSIGHT_STEP_INDEX = 3;

  // 0..3  (0 => first step active)
  const [visualStepIndex, setVisualStepIndex] = useState(0);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setInsightDownloadUrl(url);
  };

  // line progress between steps (3 gaps → 0%, 33%, 66%, 100%)
  const progressPercent = React.useMemo(() => {
    const maxIndex = steps.length - 1; // 3
    return (visualStepIndex / maxIndex) * 100;
  }, [visualStepIndex]);

  // --------------------------
  // Preview handling
  // --------------------------
  useEffect(() => {
    let url: string | null = null;

    if (files.length === 0) {
      setPreviewUrl(null);
      setTextPreview(null);
      setCsvPreview(null);
      setXlsxPreview(null);
      return;
    }

    const file = files[0];
    const fileName = file.name.toLowerCase();
    const mime = file.type;

    // reset all previews
    setPreviewUrl(null);
    setTextPreview(null);
    setCsvPreview(null);
    setXlsxPreview(null);

    if (mime.startsWith("image/") || mime === "application/pdf") {
      // IMAGE / PDF
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (mime === "text/plain" || fileName.endsWith(".txt")) {
      // TXT
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextPreview((e.target?.result as string) ?? "");
      };
      reader.readAsText(file);
    } else if (mime === "text/csv" || fileName.endsWith(".csv")) {
      // CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) ?? "";
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const rows = lines.slice(0, 20).map((line) => line.split(","));
        setCsvPreview(rows);
      };
      reader.readAsText(file);
    } else if (
      mime ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileName.endsWith(".xlsx")
    ) {
      // XLSX
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as any[][];
        const limited = rows.slice(0, 20).map((r) => r.map((v) => String(v ?? "")));
        setXlsxPreview(limited);
      };
      reader.readAsArrayBuffer(file);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [files]);

  // --------------------------
  // File events
  // --------------------------
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    const selected: File[] = fileList ? Array.from(fileList) : [];
    setFiles(selected);
    setVisualStepIndex(0);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const dropped: File[] = Array.from(fileList);
    setFiles(dropped);
    setVisualStepIndex(0);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // --------------------------
  // Upload + sequential APIs
  // --------------------------
  const uploadAndRunPipeline = async (fileArray: File[]) => {
    try {
      if (fileArray.length === 0) return;

      setLoading(true);
      setVisualStepIndex(0);

      const uploadFormData = new FormData();
      uploadFormData.append("file", fileArray[0]);

      const uploadRes = await fetch("https://app-billzynergy-backend-dev.azurewebsites.net/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (uploadRes.status !== 200) {
        throw new Error(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
      }

      for (let i = 0; i < pipelineUrls.length; i++) {
        const url = pipelineUrls[i];
        const res = await fetch(url, { method: "GET" });

        if (res.status !== 200) {
          throw new Error(`Step failed: ${url} – ${res.status} ${res.statusText}`);
        }

        // Handle the final step (INSIGHT) which provides the downloadable HTML
        if (i === INSIGHT_STEP_INDEX) {
          const htmlContent = await res.text(); // Response is text (HTML)
          downloadFile(htmlContent); // Trigger download after the final step
        }

        const completedCount = i + 1;
        const newIndex = Math.min(completedCount, 4);
        setVisualStepIndex(newIndex);
      }

      // alert("All steps completed successfully!");
    } catch (error) {
      console.error("Pipeline error:", error);
      alert("Something went wrong during reconciliation.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedClick = async () => {
    if (files?.length === 0 || loading) return;
    await uploadAndRunPipeline(files);
  };

  const firstFile = files[0];

  return (
    <Box className="upload-root">
      <Box className="upload-container">
        {/* Breadcrumb */}
        <Breadcrumbs
          aria-label="breadcrumb"
          className="upload-breadcrumbs"
          separator="›"
        >
          <Link underline="hover" color="inherit" href={paths?.welcome}>
            Home
          </Link>
          <Typography color="text.primary">Upload</Typography>
        </Breadcrumbs>

        {/* Title */}
        <Typography variant="h4" className="upload-title">
          Upload Invoice Files
        </Typography>

        {/* Dropzone */}
        <Card
          elevation={0}
          className="upload-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Box className="upload-dropzone-inner">
            {!firstFile && (
              <>
                <CloudUploadOutlinedIcon className="upload-icon" />
                <Typography variant="body1" className="upload-main-text">
                  Drag and drop your invoice files here
                </Typography>
                <Typography variant="body2" className="upload-or-text">
                  or
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  className="upload-browse-btn"
                  onClick={handleBrowseClick}
                  disabled={loading}
                >
                  Browse Files
                </Button>
              </>
            )}

            {firstFile && (
              <Box className="upload-preview-wrapper">
                <Typography className="upload-preview-label">
                  Selected File: {firstFile.name}
                </Typography>

                {previewUrl && firstFile.type.startsWith("image/") && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="upload-preview-image"
                  />
                )}

                {previewUrl && firstFile.type === "application/pdf" && (
                  <iframe
                    title="pdf-preview"
                    src={previewUrl}
                    className="upload-preview-frame"
                  />
                )}

                {textPreview && (
                  <Box className="upload-preview-text">
                    <pre>{textPreview}</pre>
                  </Box>
                )}

                {csvPreview && (
                  <Box className="upload-preview-table">
                    <table>
                      <tbody>
                        {csvPreview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}

                {xlsxPreview && (
                  <Box className="upload-preview-table">
                    <table>
                      <tbody>
                        {xlsxPreview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}

                {!previewUrl &&
                  !textPreview &&
                  !csvPreview &&
                  !xlsxPreview && (
                    <Box className="upload-preview-generic">
                      <CloudUploadOutlinedIcon className="upload-icon" />
                      <Typography variant="body2" color="text.secondary">
                        Preview not available for this file type.
                      </Typography>
                    </Box>
                  )}

                <Button
                  variant="text"
                  size="small"
                  onClick={handleBrowseClick}
                  className="upload-change-btn"
                  disabled={loading}
                >
                  Change file
                </Button>
              </Box>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              multiple={false}
              ref={fileInputRef}
              onChange={handleFileChange}
              className="upload-file-input"
            />
          </Box>
        </Card>

        {/* Proceed button */}
        <Box className="upload-proceed-wrapper">
          <Button
            variant="contained"
            size="large"
            className="upload-proceed-btn"
            onClick={handleProceedClick}
            disabled={files.length === 0 || loading}
          >
            {loading ? "Running AI Reconciliation..." : "Run AI Reconciliation"}
          </Button>
        </Box>

        {insightDownloadUrl && (
          <Box className="upload-proceed-wrapper">
            <Button
              variant="contained"
              color="primary"
              href={insightDownloadUrl}
              download="invoice_discrepancy_report.html"
              className="upload-proceed-btn"
            >
              <DownloadOutlinedIcon style={{ marginRight: "8px" }} />
              Download Report
            </Button>
          </Box>
        )}

        {/* Stepper */}
        <Box className="upload-stepper">
          {/* track behind circles */}
          <Box className="upload-stepper-track">
            <Box
              className="upload-stepper-track-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </Box>

          {/* circles row */}
          <Box className="upload-stepper-circles-row">
            {steps.map((step, index) => {
              const isCompleted = index < visualStepIndex;
              const isActive = index === visualStepIndex;

              return (
                <Box key={step.id} className="upload-step-circle-wrapper">
                  <Box
                    className={[
                      "upload-step-circle",
                      isActive ? "active" : "",
                      isCompleted ? "completed" : "",
                    ].join(" ")}
                  >
                    {isCompleted ? <CheckIcon fontSize="small" /> : step.id}
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* labels row */}
          <Box className="upload-stepper-label-row">
            {steps.map((step, index) => {
              const isActive = index === visualStepIndex;
              return (
                <Box key={step.id} className="upload-step-label-wrapper">
                  <Typography
                    className={
                      "upload-step-title" + (isActive ? " active" : "")
                    }
                  >
                    {step.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Upload;
