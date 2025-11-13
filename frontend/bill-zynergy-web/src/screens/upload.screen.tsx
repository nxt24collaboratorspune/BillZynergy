import React, {
  useRef,
  useState,
  ChangeEvent,
  DragEvent,
  FC,
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
import "./css/upload.css";
import { paths } from "../helper";

const Upload: FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    const selected: File[] = fileList ? Array.from(fileList) : [];
    setFiles(selected);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const dropped: File[] = fileList ? Array.from(fileList) : [];
    setFiles(dropped);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRunReconciliation = () => {
    // TODO: hook this to your upload / API call
    console.log("Run AI Reconciliation with files:", files);
  };

  return (
    <Box className="upload-root">
      <Box className="upload-container">
        {/* Breadcrumbs */}
        <Breadcrumbs
          aria-label="breadcrumb"
          className="upload-breadcrumbs"
          separator="›"
        >
          <Link underline="hover" color="inherit" href={paths?.welcome}>
            Home
          </Link>
          <Link underline="hover" color="inherit" href={paths?.welcome}>
            <Typography color="text.primary">Upload</Typography>
          </Link>
        </Breadcrumbs>

        {/* Title */}
        <Typography variant="h4" className="upload-title">
          Upload Invoice Files
        </Typography>

        {/* Dropzone Card */}
        <Card
          elevation={0}
          className="upload-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Box className="upload-dropzone-inner">
            <CloudUploadOutlinedIcon className="upload-icon" />

            <Typography variant="body1" className="upload-main-text">
              Drag and drop your invoice files here
            </Typography>

            <Typography variant="body2" className="upload-or-text">
              or
            </Typography>

            <Button
              variant="outlined"
              size="small"
              className="upload-browse-btn"
              onClick={handleBrowseClick}
            >
              Browse Files
            </Button>

            {/* hidden file input */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="upload-file-input"
            />
          </Box>
        </Card>

        {/* Run button */}
        <Button
          variant="contained"
          size="large"
          className="upload-run-btn"
          onClick={handleRunReconciliation}
          disabled={files.length === 0}
        >
          Run AI Reconciliation
        </Button>

        {/* Optional tiny files list */}
        {files.length > 0 && (
          <Typography variant="caption" className="upload-files-caption">
            {files.length} file(s) selected
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Upload;
