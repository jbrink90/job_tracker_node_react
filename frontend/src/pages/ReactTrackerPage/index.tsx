import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { ReactTable, NavBar } from "../../components";
import "./index.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "@mytypes/Job";
import Tooltip from '@mui/material/Tooltip';

const ReactTrackerPage = () => {
  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job>(
    masterJobList[selectedJobIndex ?? 0]
  );
  const [addingNewJob, setAddingNewJob] = useState(false);

  const getAllJobs = async () => {
    try {
      const response = await fetch("/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMasterJobList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteJob = async (indexNumber: number) => {
    setMasterJobList(
      masterJobList.filter((_, index) => index !== indexNumber)
    );
    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(masterJobList[indexNumber]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addJob = async (jobValues: Job) => {
    jobValues.last_updated = new Date();
    setMasterJobList([...masterJobList, jobValues]);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobValues),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveJob = async (jobValues: Job) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobValues),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const slideoutNewJob = () => {
    setAddingNewJob(true);
    slideIn();
  };

  useEffect(() => {
    getAllJobs();
  },[])

  useEffect(() => {
    setCurrentEditingJob(masterJobList[selectedJobIndex]);
  }, [selectedJobIndex, masterJobList]);

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
    <>
      <div className="reactTrackerPage_main">
        <div className="reactTrackerPage_leftPane">
        <NavBar />

          <header
            className="reactTrackerPage_header">
            Your Applications
          </header>
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
            <ReactTable
              jobs={masterJobList}
              slideIn={slideIn}
              setSelectedJobIndex={setSelectedJobIndex}
              deleteJob={deleteJob}
              setAddingNewJob={setAddingNewJob}
            />
          </div>
        </div>
        <EditSlideout
          job={currentEditingJob}
          masterJobList={masterJobList}
          setMasterJobList={setMasterJobList}
          slideOut={slideOut}
          addingNewJob={addingNewJob}
          addJob={addJob}
          saveJob={saveJob}
        />
      </div>
    </>
  );
};
export default ReactTrackerPage;