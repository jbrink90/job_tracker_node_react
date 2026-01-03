import { useEffect, useState } from "react";
import EditSlideout from "../../components/EditSlideout";
import { NewNavBar } from "../../components";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "../../types/Job";
import Tooltip from "@mui/material/Tooltip";
import { MuiTableTest } from "../../components/MuiTableTest";
import "./index.css";
import {
  apiGetJobs,
  apiAddJob,
  apiDeleteJob,
  apiSaveJob,
} from "../../lib/api_calls";
import { getUserEmailSplit, supabase } from "../../lib/supabase";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import {PageFooter} from "../../components";

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

interface DashBoardProps {
  siteTheme: "light" | "dark" | "system";
  setSiteTheme: (theme: "light" | "dark" | "system") => void;
}

const SimpleDashboard: React.FC<DashBoardProps> = ({siteTheme, setSiteTheme}) => {
  const defaultJob: Job = {
    company: "",
    job_title: "",
    description: "",
    location: "",
    status: "",
    applied: new Date(),
    last_updated: new Date(),
    supabase_id: "",
  };

  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentEditingJob, setCurrentEditingJob] = useState<Job | null>(
    defaultJob
  );
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
  const getAllJobs = async (token: string) => {
    if (!token) return; // no token yet
    try {
      const jobs = await apiGetJobs(token);
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
    if (!accessToken) return;
    try {
      await apiDeleteJob(jobId, accessToken);
      setMasterJobList((prev) => prev.filter((job) => job.id !== jobId));
      setIsSlideoutOpen(false);
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
    if (!accessToken) return;
    jobValues.last_updated = new Date();
    try {
      const newJob = await apiAddJob(jobValues, accessToken);
      setMasterJobList((prev) => [...prev, newJob]);
      setIsSlideoutOpen(false);
      setIsDeleteModalVisible(false);
      setSelectedJobId(null);
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
    if (!accessToken) return;
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
    if (selectedJobId == null) {
      setCurrentEditingJob(defaultJob);
      return;
    }

    const job = masterJobList.find((j) => j.id === selectedJobId);
    setCurrentEditingJob(job ?? defaultJob);
  }, [selectedJobId, masterJobList]);

  return (
    <>
    <div className="reactTrackerPage_main">
      <NewNavBar siteTheme={siteTheme} setSiteTheme={setSiteTheme} />

      <div className="reactTrackerPage_leftPane">
        <div className="reactTrackerPage_headerContainer">
          <header className="reactTrackerPage_header">
           Your Applications
          </header>
          <div className="reactTrackerPage_buttonsInner">
            <Tooltip title="Refresh Applications">
              <button>
                <RefreshIcon
                  onClick={() => {
                    getAllJobs(accessToken || "");
                  }}
                />
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
            setIsDeleteModalVisible={setIsDeleteModalVisible}
          />
        </div>
      </div>
      <PageFooter />
      <EditSlideout
        currentEditingJob={currentEditingJob ?? defaultJob}
        isSlideoutOpen={isSlideoutOpen}
        setIsSlideoutOpen={setIsSlideoutOpen}
        isAddingNewJob={isAddingNewJob}
        addJob={addJob}
        saveJob={saveJob}
        onSaveJob={onSaveJob}
        setIsDeleteModalVisible={setIsDeleteModalVisible}
      />
      <Modal
        open={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      >
        <Box sx={modalStyle} style={{ padding: "10px" }}>
          <CloseIcon
            fontSize="small"
            onClick={() => setIsDeleteModalVisible(false)}
          />
          <div className="deleteJob_modal-message">
            {`Are you sure you want to delete your ${currentEditingJob?.job_title} application to ${currentEditingJob?.company}?`}
          </div>
          <button
            className="deleteJob_modal-button"
            onClick={() => selectedJobId && deleteJob(selectedJobId).then(() => setIsDeleteModalVisible(false))}
          >
            Yes
          </button>
          <button
            className="deleteJob_modal-button"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            Cancel
          </button>
        </Box>
      </Modal>
    </div>
    </>
    );
};
export default SimpleDashboard;
