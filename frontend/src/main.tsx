import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import { Home, ReactTrackerPage, TestPage, MapPage, LoginPage } from "./pages";
import { MuiTableTest } from "./components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table" element={<MuiTableTest />} />
        <Route path="/reacttracker" element={<ReactTrackerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  </LocalizationProvider>
);
