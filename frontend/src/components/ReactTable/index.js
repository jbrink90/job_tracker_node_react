import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import "./index.css";
import "@fontsource/ubuntu/400.css";
import dayjs from "dayjs";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#3E3E3E",
    border: "1px solid #000",
    boxShadow: "5px 5px 10px #00000057",
    borderRadius: "7px",
};
const ReactTable = ({ slideIn, jobs, setSelectedJobIndex, deleteJob, setAddingNewJob, }) => {
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [jobIndexToDelete, setJobIndexToDelete] = useState(-1);
    const openSaveModal = () => setIsSaveModalVisible(true);
    const closeSaveModal = () => setIsSaveModalVisible(false);
    return (_jsxs(_Fragment, { children: [_jsxs("table", { className: "reactTracker_table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Company" }), _jsx("th", { children: "Position" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Location" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Applied" }), _jsx("th", { children: "Last Update" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { className: "reactTracker_tableBody", children: jobs.map((row, index) => (_jsxs("tr", { style: { cursor: "pointer" }, children: [_jsx("td", { children: row ? row.company : "" }), _jsx("td", { children: row ? row.job_title : "" }), _jsx("td", { children: row ? row.description?.substring(0, 40) : "" }), _jsx("td", { children: row ? row.location : "" }), _jsx("td", { children: row ? row.status : "" }), _jsx("td", { children: row?.applied ? dayjs(row.applied).format("MM/DD/YYYY") : "" }), _jsx("td", { children: row?.last_updated
                                        ? dayjs(row.last_updated).format("MM/DD/YYYY")
                                        : "" }), _jsxs("td", { children: [_jsx(Tooltip, { title: `Edit ${row.job_title?.substring(0, 25)}`, children: _jsx("span", { className: "reactTracker_editButton", onClick: (e) => {
                                                    setAddingNewJob(false);
                                                    e.stopPropagation();
                                                    setSelectedJobIndex(index);
                                                    slideIn();
                                                }, children: _jsx(EditDocumentIcon, { sx: { color: "#e1e1e1" } }) }) }), _jsx(Tooltip, { title: `Delete ${row.job_title?.substring(0, 25)}`, children: _jsx("span", { className: "reactTracker_delButton", onClick: (e) => {
                                                    e.stopPropagation();
                                                    setJobIndexToDelete(index);
                                                    openSaveModal();
                                                }, children: _jsx(DeleteIcon, { sx: { color: "#e1e1e1" } }) }) })] })] }, `${index}9`))) })] }), _jsx(Modal, { open: isSaveModalVisible, onClose: closeSaveModal, children: _jsxs(Box, { sx: modalStyle, style: {
                        padding: "10px",
                    }, children: [_jsx(CloseIcon, { fontSize: "small", onClick: closeSaveModal }), _jsx("h2", { className: "reactTracker_modal-message", children: "Really delete application?" }), _jsxs("div", { className: "reactTracker_modal-buttonDiv", children: [_jsx("button", { className: "reactTracker_modal-button", onClick: () => {
                                        deleteJob(jobIndexToDelete);
                                        setJobIndexToDelete(-1);
                                        closeSaveModal();
                                    }, children: "Yes" }), _jsx("button", { className: "reactTracker_modal-button", onClick: closeSaveModal, children: "No" })] })] }) })] }));
};
export default ReactTable;
