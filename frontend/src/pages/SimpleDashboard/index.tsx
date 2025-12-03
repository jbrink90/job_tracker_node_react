import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { ReactTable, NavBar } from "../../components";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "@mytypes/Job";
import Tooltip from "@mui/material/Tooltip";
import { JobTable } from "../../components/JobTable";
import { MuiTableTest } from "../../components/MuiTableTest";
import "simple-table-core/styles.css";
import "./index.css";
import { apiGetJobs, apiAddJob, apiDeleteJob, apiSaveJob } from "src/lib/api_calls";

const SimpleDashboard = () => {
  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job>(masterJobList[selectedJobIndex ?? 0]);
  const [addingNewJob, setAddingNewJob] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const defaultJob: Job = { company: "", job_title: "", description: "", location: "", status: "", applied: new Date(), last_updated: new Date(), };

  const getAllJobs = async () => {
    try {
      const jobs = await apiGetJobs();
      setMasterJobList(jobs);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (index: number) => {
    const job = masterJobList[index];
    setMasterJobList(prev => prev.filter((_, i) => i !== index));
  
    try {
      await apiDeleteJob(job);
    } catch (error) {
      console.error(error);
    }
  };
  

  const addJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();
  
    try {
      const newJob = await apiAddJob(jobValues);
      setMasterJobList(prev => [...prev, newJob]);
    } catch (error) {
      console.error(error);
    }
  };
  

  const saveJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();

    try {
      await apiSaveJob(jobValues);
    } catch (error) {
      console.error(error);
    }
  };

  const slideoutNewJob = () => {
    setAddingNewJob(true);
    slideIn();
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId != null) {
      const job = masterJobList.find(j => j.id === selectedJobId);
      setCurrentEditingJob(job ?? defaultJob);
    }
  }, [selectedJobId, masterJobList]);

  const slideIn = () => {
    const slideout: HTMLElement = document.getElementsByTagName("aside")[0];
    slideout.classList.remove("slide-out-right");
    slideout.classList.add("slide-in-right");
  };
  const slideOut = () => {
    const slideout: HTMLElement = document.getElementsByTagName("aside")[0];
    slideout.classList.remove("slide-in-right");
    slideout.classList.add("slide-out-right");
  };

  return (
    <div className="reactTrackerPage_main">
      <div className="reactTrackerPage_leftPane">
        <NavBar isUserLoggedIn={false} />

        <header className="reactTrackerPage_header">Applications</header>
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
            setSelectedJobId={setSelectedJobId}
            jobs={masterJobList} 
            slideIn={slideIn}
            setSelectedJobIndex={setSelectedJobIndex}
            deleteJob={deleteJob}
            setAddingNewJob={setAddingNewJob}
          />

        </div>
      </div>
      <EditSlideout
        setCurrentEditingJob={setCurrentEditingJob}
        currentEditingJob={currentEditingJob}
        masterJobList={masterJobList}
        setMasterJobList={setMasterJobList}
        slideOut={slideOut}
        addingNewJob={addingNewJob}
        addJob={addJob}
        saveJob={saveJob}
      />
    </div>
);
};
export default SimpleDashboard;