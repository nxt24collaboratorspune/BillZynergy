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
  const [loading, setLoading] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  // When user selects files from browse
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event?.target?.files;

    const selected: File[] = fileList ? Array.from(fileList) : [];
    setFiles(selected);

    if (selected?.length > 0) {
      await uploadFiles(selected);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const dropped: File[] = fileList ? Array.from(fileList) : [];
    setFiles(dropped);

    if (dropped.length > 0) {
      await uploadFiles(dropped);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadFiles = async (fileArray: File[]) => {
    try {
      setLoading(true);
        if (fileArray.length === 0) return;

      const formData = new FormData();
       formData.append("file", fileArray[0]);
      // fileArray.forEach((file) => formData.append("files", file));

      const response = await fetch("https://app-billzynergy-backend-dev.azurewebsites.net/upload", {
        method: "POST",
        body: formData,
        // headers: {
        //   Accept: "application/json",
        // },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload success:", data);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="upload-root">
      <Box className="upload-container">
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

        <Typography variant="h4" className="upload-title">
          Upload Invoice
        </Typography>

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
              variant="contained"
              size="small"
              className="upload-browse-btn"
              onClick={handleBrowseClick}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Browse"}
            </Button>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="upload-file-input"
            />
          </Box>
        </Card>

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
