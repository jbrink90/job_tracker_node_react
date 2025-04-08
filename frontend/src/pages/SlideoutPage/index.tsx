import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { ReactTable } from "../../components";
import "./index.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "@mytypes/Job";

const SlideoutPage = () => {
  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job>(
    masterJobList[selectedJobIndex ?? 0]
  );
  const [addingNewJob, setAddingNewJob] = useState(false);

  const getAllJobs = async () => {
    try {
      const response = await fetch("/api/all", {
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
    try {
      const response = await fetch("/api/deletejob", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(masterJobList[indexNumber]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //const data = await response.json();
      setMasterJobList(
        masterJobList.filter((_, index) => index !== indexNumber)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addJob = async (jobValues: Job) => {
    try {
      const response = await fetch("/api/addjob", {
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
      <div className="slideOutPage_leftPane">
        <header
          style={{
            textAlign: "left",
            marginBottom: "0px",
            fontSize: "xxx-large",
          }}
        >
          Current Applications
        </header>
        <div className="slideoutPage_buttonsContainer">
          <div className="slideoutPage_buttonsInner">
            <button>
              <RefreshIcon onClick={getAllJobs} fontSize="large" />
            </button>
            <button>
              <AddIcon onClick={slideoutNewJob} fontSize="large" />
            </button>
          </div>
        </div>
        <ReactTable
          jobs={masterJobList}
          slideIn={slideIn}
          setSelectedJobIndex={setSelectedJobIndex}
          deleteJob={deleteJob}
          setAddingNewJob={setAddingNewJob}
        />
      </div>
      <EditSlideout
        job={currentEditingJob}
        masterJobList={masterJobList}
        setMasterJobList={setMasterJobList}
        slideOut={slideOut}
        addingNewJob={addingNewJob}
        addJob={addJob}
      />
    </>
  );
};
export default SlideoutPage;
