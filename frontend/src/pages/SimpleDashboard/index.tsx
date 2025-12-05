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
import { getUserEmailSplit } from "../../lib/supabase";

const userEmail = await getUserEmailSplit(); 

const SimpleDashboard = () => {
  const defaultJob: Job = { company: "", job_title: "", description: "", location: "", status: "", applied: new Date(), last_updated: new Date(), };

  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job | null>(defaultJob);
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);

  const getAllJobs = async () => {
    try {
      const jobs = await apiGetJobs();
      setMasterJobList(jobs);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteJob = async (jobId: number) => {
  
    try {
      await apiDeleteJob(jobId);
      console.log(`Deleted job with id`);
      setMasterJobList(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error(error);
    }
  };
  const addJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();
  
    try {
      const newJob = await apiAddJob(jobValues);
      setMasterJobList(prev => [...prev, newJob]);
      setIsSlideoutOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add job. Please try again.");
    }
  };
  const saveJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();

    try {
      await apiSaveJob(jobValues);
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
        <NavBar isUserLoggedIn={false} />

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