import React from "react";
import { Button } from "@mui/material";
import "./css/button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  bgColor?: string;
  color?: string;
  fullWidth?: boolean;
}

const UIButton = ({ text, onClick, bgColor, color, fullWidth }: ButtonProps) => {
  return (
    <Button
      variant="contained"
      className="ui-button"
      onClick={onClick}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: bgColor || undefined,
        color: color || undefined,
      }}
    >
      {text}
    </Button>
  );
};

export default UIButton;
