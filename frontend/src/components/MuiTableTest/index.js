import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "@fontsource/roboto/400.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import "./index.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        background: { default: "#121212", paper: "#1d1d1d" },
    },
});
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#3E3E3E",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "7px",
};
export const MuiTableTest = ({ jobs, setIsSlideoutOpen, setIsAddingNewJob, selectedJobId, setSelectedJobId, deleteJob }) => {
    const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
    const openDeleteModal = () => setIsDeleteModalVisible(true);
    const closeDeleteModal = () => setIsDeleteModalVisible(false);
    const columns = [
        { field: "company", headerName: "Company", flex: 1, sortable: true, filterable: true },
        { field: "job_title", headerName: "Job Title", flex: 1, sortable: true, filterable: true },
        { field: "location", headerName: "Location", flex: 1, sortable: true, filterable: true },
        { field: "status", headerName: "Status", flex: 1, sortable: true, filterable: true },
        {
            field: "applied",
            headerName: "Applied",
            flex: 1,
            sortable: true,
            filterable: true,
            type: "date",
        },
        {
            field: "last_updated",
            headerName: "Last Updated",
            flex: 1,
            sortable: true,
            filterable: true,
            type: "date",
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 150,
            sortable: false,
            filterable: false,
            hideable: false,
            align: 'center',
            renderCell: (params) => (_jsxs(_Fragment, { children: [_jsx("button", { style: { backgroundColor: '#00bffe', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }, onClick: (e) => {
                            e.stopPropagation();
                            setSelectedJobId(params.row.id);
                            setIsAddingNewJob(false);
                            setIsSlideoutOpen(true);
                        }, children: "Edit" }), _jsx("button", { style: { backgroundColor: '#00bffe', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }, onClick: (e) => {
                            setSelectedJobId(params.row.id);
                            e.stopPropagation();
                            openDeleteModal();
                            // if (window.confirm(`Are you sure you want to delete job ID ${params.row.id}?`)) {
                            //   deleteJob(params.row.id);
                            //   console.log(`Delete job ID ${params.row.id}`);
                            // }
                        }, children: "Delete" })] }))
        },
    ];
    const formattedJobs = jobs.map(job => ({
        id: job.id,
        ...job,
        applied: job.applied ? new Date(job.applied) : null,
        last_updated: job.last_updated ? new Date(job.last_updated) : null,
    }));
    return (_jsxs(_Fragment, { children: [_jsx(ThemeProvider, { theme: darkTheme, children: _jsx(Paper, { elevation: 12, children: _jsx(DataGrid, { rows: formattedJobs, columns: columns, sx: { display: 'flex', flexDirection: 'column' } }) }) }), _jsx(Modal, { open: isDeleteModalVisible, onClose: closeDeleteModal, children: _jsxs(Box, { sx: modalStyle, style: { padding: "10px" }, children: [_jsx(CloseIcon, { fontSize: "small", onClick: closeDeleteModal }), _jsxs("h2", { className: "editSlideout_modal-message", children: ["Are you sure you want to delete job with ID '", selectedJobId, "'?"] }), _jsx("button", { className: "editSlideout_modal-button", onClick: () => selectedJobId && (deleteJob(selectedJobId), closeDeleteModal(), true), children: "Yes" }), _jsx("button", { className: "editSlideout_modal-button", onClick: closeDeleteModal, children: "Cancel" })] }) })] }));
};
export default MuiTableTest;
