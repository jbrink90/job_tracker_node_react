import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { NavBar } from "../../components";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "@mytypes/Job";
import Tooltip from "@mui/material/Tooltip";
import { MuiTableTest } from "../../components/MuiTableTest";
import "simple-table-core/styles.css";
import "./index.css";
import { apiGetJobs, apiAddJob, apiDeleteJob, apiSaveJob } from "src/lib/api_calls";
import { getUserEmailSplit, supabase } from "../../lib/supabase";

const userEmail = await getUserEmailSplit();
const session = await supabase.auth.getSession();
const accessToken = session.data.session?.access_token ?? null;


const SimpleDashboard = () => {
  const defaultJob: Job = { company: "", job_title: "", description: "", location: "", status: "", applied: new Date(), last_updated: new Date(), supabase_id: "" };

  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job | null>(defaultJob);
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);

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
  const getAllJobs = async () => {
    try {
      const jobs = await apiGetJobs(accessToken);
      setMasterJobList(jobs);
    } catch (error) {
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
  const deleteJob = async (jobId: number) => {
    try {
      await apiDeleteJob(jobId, accessToken);
      console.log(`Deleted job with id`);
      setMasterJobList(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
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
  const addJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();
    try {
      const newJob = await apiAddJob(jobValues, accessToken);
      setMasterJobList(prev => [...prev, newJob]);
      setIsSlideoutOpen(false);
    } catch (error) {
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
  const saveJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();
    try {
      await apiSaveJob(jobValues, accessToken);
      setMasterJobList(
        masterJobList.map((item) =>
          item.id === jobValues.id ? jobValues : item
        )
      );
      setIsSlideoutOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save job. Please try again.");
    }
  };

  const onSaveJob = (jobValues: Job) => {
    if (isAddingNewJob) {
      addJob(jobValues);
    } else {
      saveJob(jobValues);
    }
  };

  const slideoutNewJob = () => {
    setSelectedJobId(null);
    setIsAddingNewJob(true);
    setIsSlideoutOpen(true);
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId == null) {
      setCurrentEditingJob(defaultJob);
      return;
    }
  
    const job = masterJobList.find(j => j.id === selectedJobId);
    setCurrentEditingJob(job ?? defaultJob);
  }, [selectedJobId, masterJobList]);
  

  return (
    <div className="reactTrackerPage_main">
      <div className="reactTrackerPage_leftPane">
        <NavBar userEmailSplit={userEmail} />

        <header className="reactTrackerPage_header">{userEmail ? userEmail + "'s" : 'Your'} Applications</header>
        <div className="reactTrackerPage_buttonsContainer">
          <div className="reactTrackerPage_buttonsInner">
            <Tooltip title="Refresh Applications">
              <button>
                <RefreshIcon onClick={getAllJobs} />
              </button>
            </Tooltip>
            <Tooltip title="Add New Application">
              <button>
                <AddIcon onClick={slideoutNewJob} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="reactTrackerPage_tableContainer">
          
          <MuiTableTest
            jobs={masterJobList} 
            setIsSlideoutOpen={setIsSlideoutOpen}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            deleteJob={deleteJob}
            setIsAddingNewJob={setIsAddingNewJob}
          />

        </div>
      </div>
      <EditSlideout
        currentEditingJob={currentEditingJob ?? defaultJob}
        isSlideoutOpen={isSlideoutOpen}
        setIsSlideoutOpen={setIsSlideoutOpen}
        isAddingNewJob={isAddingNewJob}
        addJob={addJob}
        saveJob={saveJob}
        onSaveJob={onSaveJob}
      />
    </div>
);
};
export default SimpleDashboard;