import { useEffect, useState, useRef } from "react";
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
import { supabase } from "../../lib/supabase";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import {PageFooter} from "../../components";
import { Button } from '@mui/material';

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
  siteTheme: "light" | "dark";
  setSiteTheme: (theme: "light" | "dark") => void;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }
}
export {};



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
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  async function onInstallClick() {
    const promptEvent = deferredPrompt.current;
    console.log('onInstallClick called, promptEvent=', promptEvent);
  
    if (!promptEvent) {
      console.log('No saved beforeinstallprompt event — cannot prompt');
      return;
    }
  
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      console.log('userChoice', choice);
      if (choice.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
        localStorage.setItem('pwa-install-dismissed', '1');
      }
    } finally {
      deferredPrompt.current = null;
    }
  }

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      console.log('beforeinstallprompt saved', deferredPrompt.current);
    };
  
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const session = await supabase.auth.getSession();
      setAccessToken(session.data.session?.access_token ?? null);
      // optionally fetch jobs here once token is ready
      if (session.data.session?.access_token) {
        await getAllJobs(session.data.session.access_token);
      }
    };
    initUser();
  }, []);

  useEffect(() => {
    if (selectedJobId == null) {
      setCurrentEditingJob(defaultJob);
      return;
    }

    const job = masterJobList.find((j) => j.id === selectedJobId);
    setCurrentEditingJob(job ?? defaultJob);
  }, [selectedJobId, masterJobList]);

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
      setIsDataLoading(true);
      const jobs = await apiGetJobs(token);
      setMasterJobList(jobs);
      setIsDataLoading(false);
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
      setIsDataLoading(true);
      await apiDeleteJob(jobId, accessToken);
      setMasterJobList((prev) => prev.filter((job) => job.id !== jobId));
      setIsSlideoutOpen(false);
      setIsDataLoading(false);
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
      setIsDataLoading(true);
      const newJob = await apiAddJob(jobValues, accessToken);
      setMasterJobList((prev) => [...prev, newJob]);
      setIsSlideoutOpen(false);
      setIsDeleteModalVisible(false);
      setSelectedJobId(null);
      setIsDataLoading(false);
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
              <Button 
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                sx={{ alignItems: "center" }}
                onClick={() => {
                  setIsDataLoading(true);
                  getAllJobs(accessToken || "").then(() => setIsDataLoading(false));
                }}>
                  Refresh
              </Button>
            </Tooltip>
            <Tooltip title="Add New Application">
              <Button 
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ marginLeft: "10px", alignItems: "center" }}
                onClick={slideoutNewJob}>
                 Add Job
              </Button>
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
            isDataLoading={isDataLoading}
          />
        </div>
      </div>
      <PageFooter onInstallClick={onInstallClick} />
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
