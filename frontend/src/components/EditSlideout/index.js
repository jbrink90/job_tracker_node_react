import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SearchableMap from "../SearchableMap";
import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, imagePlugin, InsertImage, ListsToggle, } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
const defaultJob = {
    company: "",
    job_title: "",
    description: "",
    location: "",
    status: "",
    applied: new Date(),
    last_updated: new Date(),
    supabase_id: "",
};
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
const EditSlideout = ({ setIsSlideoutOpen, isSlideoutOpen, currentEditingJob, isAddingNewJob, addJob, saveJob, onSaveJob, }) => {
    const [jobValues, setJobValues] = useState(defaultJob);
    const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const editorRef = useRef(null);
    const [markdownSource, setMarkdownSource] = useState("");
    const openMapModal = () => setIsMapModalVisible(true);
    const closeMapModal = () => setIsMapModalVisible(false);
    const openSaveModal = () => setIsSaveModalVisible(true);
    const closeSaveModal = () => setIsSaveModalVisible(false);
    const toggleLocalSlideout = () => {
        if (hasJobBeenModified) {
            openSaveModal();
        }
        else {
            setIsSlideoutOpen(false);
        }
    };
    useEffect(() => {
        if (!isSlideoutOpen)
            return;
        if (isAddingNewJob) {
            setJobValues(defaultJob);
            setMarkdownSource("");
        }
        else {
            setJobValues(currentEditingJob || defaultJob);
            setMarkdownSource(currentEditingJob?.description || "");
        }
        setHasJobBeenModified(false);
    }, [currentEditingJob, isAddingNewJob, isSlideoutOpen]);
    const handleEditorMarkdownChange = (newMarkdown, isInitial) => {
        if (!isInitial) {
            setMarkdownSource(newMarkdown);
            setJobValues(prev => ({
                ...prev,
                description: newMarkdown,
            }));
            setHasJobBeenModified(true);
        }
    };
    const discardChanges = () => {
        setJobValues({ ...currentEditingJob });
        setMarkdownSource(currentEditingJob.description || "");
        setHasJobBeenModified(false);
        setIsSlideoutOpen(false);
        closeSaveModal();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobValues((prevJob) => ({
            ...prevJob,
            [name]: value,
        }));
        setHasJobBeenModified(true);
    };
    const saveApplication = () => {
        closeSaveModal();
        if (isAddingNewJob) {
            try {
                addJob(jobValues);
                setJobValues(defaultJob);
                setIsSlideoutOpen(false);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
        else {
            try {
                // setMasterJobList(
                //   masterJobList.map((item) =>
                //     item.id === jobValues.id ? jobValues : item
                //   )
                // );
                saveJob(jobValues);
                setHasJobBeenModified(false);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("aside", { className: `editSlideout_container ${isSlideoutOpen ? 'slide-in-right' : 'slide-out-right'}`, children: [_jsx("div", { className: "editSlideout_navRow", children: _jsx(CloseIcon, { fontSize: "large", onClick: () => {
                                toggleLocalSlideout();
                            } }) }), _jsxs("div", { className: "editSlideout_content", children: [_jsx("header", { className: "editSlideout_header", children: isAddingNewJob ? "Add Job" : "Edit Job" }), _jsx("label", { children: "Company" }), _jsx("input", { type: "text", name: "company", value: jobValues ? jobValues.company : "", onChange: handleInputChange }), _jsx("label", { children: "Position" }), _jsx("input", { type: "text", name: "job_title", value: jobValues ? jobValues.job_title : "", onChange: handleInputChange }), _jsx("label", { children: "Description" }), _jsx(MDXEditor, { ref: editorRef, markdown: markdownSource, onChange: handleEditorMarkdownChange, contentEditableClassName: "editSlideout_mdxeditor_text", plugins: [
                                    imagePlugin(),
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    imagePlugin({
                                        imageUploadHandler: () => {
                                            return Promise.resolve("https://lh3.googleusercontent.com/proxy/ByPklvBVCoshX99JEmMxg0DLx_7Ig_AyAkP5095aUlAuk22vxeD4W6pOxPPaWetDpu1RgvGms593mFnQtuw5uAerl_eBzmD-x_uIDJXTK4OcUfL8PNRh");
                                        },
                                    }),
                                    toolbarPlugin({
                                        toolbarClassName: "editSlideout_mdxeditor_toolbar",
                                        toolbarContents: () => (_jsxs(_Fragment, { children: [_jsx(UndoRedo, {}), _jsx(BoldItalicUnderlineToggles, {}), _jsx(ListsToggle, {}), _jsx(InsertImage, {})] })),
                                    }),
                                ] }, `${isAddingNewJob ? "new" : jobValues.id}`), _jsx("label", { children: "Location" }), _jsxs("div", { className: "editSlideout_locationDiv", children: [_jsx("input", { type: "text", name: "location", value: jobValues ? jobValues.location : "", onChange: handleInputChange, className: "editSlideout_locationInput" }), _jsx(MapIcon, { className: "editSlideout_mapIcon", onClick: openMapModal })] }), _jsx("label", { children: "Status" }), _jsx("input", { type: "text", name: "status", value: jobValues ? jobValues.status : "", onChange: handleInputChange }), _jsx("label", { children: "Date Applied" }), _jsx(DatePicker, { value: jobValues ? dayjs(jobValues.applied?.toString()) : dayjs(), defaultValue: dayjs(), onChange: (value) => {
                                    setJobValues(prev => ({
                                        ...prev,
                                        applied: value ? value.toDate() : new Date()
                                    }));
                                    setHasJobBeenModified(true);
                                }, slotProps: {
                                    textField: {
                                        sx: {
                                            "& .MuiInputAdornment-root .MuiIconButton-root": {
                                                color: "white",
                                            },
                                            input: {
                                                color: "white",
                                                borderColor: "grey",
                                            },
                                        },
                                    },
                                } }), _jsx("label", { children: "Last Update" }), _jsx("span", { className: "editSlideout_span", children: jobValues?.last_updated
                                    ? dayjs(jobValues.last_updated).format("MM/DD/YYYY")
                                    : "" })] }), _jsx("div", { className: "editSlideout_saveDiv", children: _jsx("button", { className: "editSlideout_saveButton", onClick: () => onSaveJob(jobValues), disabled: !hasJobBeenModified, children: isAddingNewJob ? "Add Job" : "Save Job" }) })] }), _jsx(Modal, { open: isSaveModalVisible, onClose: closeSaveModal, children: _jsxs(Box, { sx: modalStyle, style: { padding: "10px" }, children: [_jsx(CloseIcon, { fontSize: "small", onClick: closeSaveModal }), _jsx("h2", { className: "editSlideout_modal-message", children: "Save your changes?" }), _jsx("button", { className: "editSlideout_modal-button", onClick: saveApplication, children: "Yes" }), _jsx("button", { className: "editSlideout_modal-button", onClick: discardChanges, children: "No" }), _jsx("button", { className: "editSlideout_modal-button", onClick: closeSaveModal, children: "Cancel" })] }) }), _jsx(Modal, { open: isMapModalVisible, onClose: closeMapModal, children: _jsxs(Box, { sx: modalStyle, children: [_jsx(CloseIcon, { fontSize: "large", onClick: () => {
                                closeMapModal();
                            } }), _jsx(SearchableMap, {})] }) })] }));
};
export default EditSlideout;
