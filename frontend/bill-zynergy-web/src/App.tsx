import React from 'react';
import Header from "./components/header";
import Footer from "./components/footer";
import Welcome from "./screens/welcome.screen";
import Upload from "./screens/upload.screen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import Dashboard from './screens/dashboard.screen';
import Reports from './screens/reports.screen';
import { paths } from './helper';

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
          bgcolor: "var(--grey-100)",
        }}
      >
        <Header />
        <Box sx={{ flex: 1, padding: 0, margin: 0 }}>
          <Routes>
            <Route path={paths?.welcome} element={<Welcome />} />
            <Route path={paths?.upload} element={<Upload />} />
            <Route path={paths?.dashboard} element={<Dashboard />} />
            <Route path={paths?.reports} element={<Reports />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
