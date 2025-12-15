import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { NavBar } from "../../components";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { MuiTableTest } from "../../components/MuiTableTest";
import "./index.css";
import { apiGetJobs, apiAddJob, apiDeleteJob, apiSaveJob } from "../../lib/api_calls";
import { getUserEmailSplit, supabase } from "../../lib/supabase";
// const userEmail = await getUserEmailSplit();
// const session = await supabase.auth.getSession();
// const accessToken = session.data.session?.access_token ?? null;
const SimpleDashboard = () => {
    const defaultJob = { company: "", job_title: "", description: "", location: "", status: "", applied: new Date(), last_updated: new Date(), supabase_id: "" };
    const [masterJobList, setMasterJobList] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [currentEditingJob, setCurrentEditingJob] = useState(defaultJob);
    const [isAddingNewJob, setIsAddingNewJob] = useState(false);
    const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
        const initUser = async () => {
            const emailSplit = await getUserEmailSplit();
            const session = await supabase.auth.getSession();
            setUserEmail(emailSplit);
            setAccessToken(session.data.session?.access_token ?? null);
            // optionally fetch jobs here once token is ready
            if (session.data.session?.access_token) {
                getAllJobs(session.data.session.access_token);
            }
        };
        initUser();
    }, []);
    /**
   * Fetch all jobs for the current user.
   *
   * @async
   * @function
   * @returns {Promise<Job[]>} Array of Job objects
   * @throws Will throw an error if the fetch fails
   *
   * @example
   * const jobs = await getAllJobs();
   */
    const getAllJobs = async (token) => {
        if (!token)
            return; // no token yet
        try {
            const jobs = await apiGetJobs(token);
            setMasterJobList(jobs);
        }
        catch (error) {
            console.error(error);
        }
    };
    /**
   * Delete a job by its ID.
   *
   * @async
   * @function
   * @param {number} jobId - The ID of the job to delete
   * @returns {Promise<void>}
   * @throws Will throw an error if the delete fails
   *
   * @example
   * await deleteJob(57);
   */
    const deleteJob = async (jobId) => {
        if (!accessToken)
            return;
        try {
            await apiDeleteJob(jobId, accessToken);
            console.log(`Deleted job with id`);
            setMasterJobList(prev => prev.filter(job => job.id !== jobId));
        }
        catch (error) {
            console.error(error);
        }
    };
    /**
   * Add a new job.
   *
   * @async
   * @function
   * @param {Job} jobValues - The job data to add
   * @returns {Promise<void>}
   * @throws Will throw an error if adding the job fails
   *
   * @example
   * await addJob({ company: 'ABC', job_title: 'Dev', ... });
   */
    const addJob = async (jobValues) => {
        if (!accessToken)
            return;
        jobValues.last_updated = new Date();
        try {
            const newJob = await apiAddJob(jobValues, accessToken);
            setMasterJobList(prev => [...prev, newJob]);
            setIsSlideoutOpen(false);
        }
        catch (error) {
            console.error(error);
            alert("Failed to add job. Please try again.");
        }
    };
    /**
     * Save updates to an existing job.
     *
     * @async
     * @function
     * @param {Job} jobValues - The updated job data
     * @returns {Promise<void>}
     * @throws Will throw an error if saving the job fails
     *
     * @example
     * await saveJob({ company: 'ABC', job_title: 'Dev', ... });
     */
    const saveJob = async (jobValues) => {
        if (!accessToken)
            return;
        jobValues.last_updated = new Date();
        try {
            await apiSaveJob(jobValues, accessToken);
            setMasterJobList(masterJobList.map((item) => item.id === jobValues.id ? jobValues : item));
            setIsSlideoutOpen(false);
        }
        catch (error) {
            console.error(error);
            alert("Failed to save job. Please try again.");
        }
    };
    const onSaveJob = (jobValues) => {
        if (isAddingNewJob) {
            addJob(jobValues);
        }
        else {
            saveJob(jobValues);
        }
    };
    const slideoutNewJob = () => {
        setSelectedJobId(null);
        setIsAddingNewJob(true);
        setIsSlideoutOpen(true);
    };
    useEffect(() => {
        if (selectedJobId == null) {
            setCurrentEditingJob(defaultJob);
            return;
        }
        const job = masterJobList.find(j => j.id === selectedJobId);
        setCurrentEditingJob(job ?? defaultJob);
    }, [selectedJobId, masterJobList]);
    return (_jsxs("div", { className: "reactTrackerPage_main", children: [_jsx(NavBar, { userEmailSplit: userEmail }), _jsxs("div", { className: "reactTrackerPage_leftPane", children: [_jsxs("header", { className: "reactTrackerPage_header", children: [userEmail ? userEmail + "'s" : 'Your', " Applications"] }), _jsx("div", { className: "reactTrackerPage_buttonsContainer", children: _jsxs("div", { className: "reactTrackerPage_buttonsInner", children: [_jsx(Tooltip, { title: "Refresh Applications", children: _jsx("button", { children: _jsx(RefreshIcon, { onClick: () => { getAllJobs(accessToken || ""); } }) }) }), _jsx(Tooltip, { title: "Add New Application", children: _jsx("button", { children: _jsx(AddIcon, { onClick: slideoutNewJob }) }) })] }) }), _jsx("div", { className: "reactTrackerPage_tableContainer", children: _jsx(MuiTableTest, { jobs: masterJobList, setIsSlideoutOpen: setIsSlideoutOpen, selectedJobId: selectedJobId, setSelectedJobId: setSelectedJobId, deleteJob: deleteJob, setIsAddingNewJob: setIsAddingNewJob }) })] }), _jsx(EditSlideout, { currentEditingJob: currentEditingJob ?? defaultJob, isSlideoutOpen: isSlideoutOpen, setIsSlideoutOpen: setIsSlideoutOpen, isAddingNewJob: isAddingNewJob, addJob: addJob, saveJob: saveJob, onSaveJob: onSaveJob }), _jsx("div", { className: "reactTrackerPage_footer", children: "\u00A9 2025 Jordan Brinkman. All rights reserved." })] }));
};
export default SimpleDashboard;
