import { useEffect, useState, useCallback } from "react";
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
  apiPullLinkedInData,
} from "../../lib/api_calls";
import { supabase } from "../../lib/supabase";
import CloseIcon from "@mui/icons-material/Close";
import { PageFooter } from "../../components";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { Box, Typography, IconButton, Modal, useTheme, useMediaQuery } from "@mui/material";

const getModalStyle = (theme: any) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 24,
  borderRadius: "7px",
  textAlign: "center",
});

interface DashBoardProps {
  siteTheme: "light" | "dark";
  setSiteTheme: (theme: "light" | "dark") => void;
}


declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }
}
export {};

const SimpleDashboard: React.FC<DashBoardProps> = ({
  siteTheme,
  setSiteTheme,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 24,
    borderRadius: "7px",
    textAlign: "center",
  };
  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
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
  const [currentEditingJob, setCurrentEditingJob] = useState<Job | null>(
    defaultJob,
  );
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTableTrigger, setRefreshTableTrigger] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
  }, []);

  useEffect(() => {
    if (accessToken) {
      getAllJobs();
    }
  }, [accessToken]);

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
  const getAllJobs = useCallback(async (resetPagination: boolean = false) => {
    if (!accessToken) return; // no token yet
    try {
      setIsDataLoading(true);
      const jobs = await apiGetJobs(accessToken);
      setMasterJobList(jobs);
      setIsDataLoading(false);
      // Only trigger table pagination reset if explicitly requested
      if (resetPagination) {
        setRefreshTableTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to fetch jobs. Please try again.", { variant: "error" });
    }
  }, [accessToken]);

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
      //setIsDataLoading(true);
      await apiDeleteJob(jobId, accessToken);
      setMasterJobList((prev) => prev.filter((job) => job.id !== jobId));
      setIsSlideoutOpen(false);
      //setIsDataLoading(false);
      showToast("Job deleted successfully.", "success")();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete job. Please try again.", { variant: "error" });

      //setIsDataLoading(false);
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
      //setIsDataLoading(true);
      const newJob = await apiAddJob(jobValues, accessToken);
      setMasterJobList((prev) => [...prev, newJob]);
      setIsSlideoutOpen(false);
      setIsDeleteModalVisible(false);
      setSelectedJobId(null);
      //setIsDataLoading(false);
      showToast("Job added successfully.", "success")();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add job. Please try again.", { variant: "error" });
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
          item.id === jobValues.id ? jobValues : item,
        ),
      );
      setIsSlideoutOpen(false);
      showToast("Job saved successfully.", "success")();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save job. Please try again.", { variant: "error" });
    }
  };

  const getLinkedInData = async (url: string) => {
    if (!accessToken) return;

    try {
      return await apiPullLinkedInData(url, accessToken);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to pull LinkedIn job data. Please try again.", { variant: "error" });
    }
  }

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

  const showToast =
    (
      message: string,
      variant: "default" | "error" | "success" | "warning" | "info" | undefined,
    ) =>
    () => {
      enqueueSnackbar(`${message}`, { variant });
    };

  const refreshTable = useCallback(() => {
    getAllJobs(true); // Explicitly reset pagination on refresh
  }, [getAllJobs]);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredJobs = masterJobList.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (job.company || "").toLowerCase().includes(searchLower) ||
      (job.job_title || "").toLowerCase().includes(searchLower) ||
      (job.location || "").toLowerCase().includes(searchLower) ||
      (job.status || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="reactTrackerPage_main">
        <NewNavBar siteTheme={siteTheme} setSiteTheme={setSiteTheme} onSearchChange={handleSearchChange} />

        <div className="reactTrackerPage_leftPane">
          <div className="reactTrackerPage_headerContainer">
            <header className="reactTrackerPage_header">
              Job Applications ({masterJobList.length})
            </header>
            <div className="reactTrackerPage_buttonsInner">
              <Tooltip title="Refresh Applications">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  sx={{ 
                    marginLeft: "10px", 
                    alignItems: "center",
                    minWidth: isMobile ? "40px" : "auto",
                    width: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "normal",
                    "& .MuiButton-startIcon": {
                      margin: isMobile ? 0 : "0 8px 0 0",
                    }
                  }}
                  onClick={() => {
                    setIsDataLoading(true);
                    getAllJobs(true);
                  }}
                >
                  {isMobile ? "" : "Refresh"}
                </Button>
              </Tooltip>
              <Tooltip title="Add New Application">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ 
                    marginLeft: "10px", 
                    alignItems: "center",
                    minWidth: isMobile ? "40px" : "auto",
                    width: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "normal",
                    "& .MuiButton-startIcon": {
                      margin: isMobile ? 0 : "0 8px 0 0",
                    }
                  }}
                  onClick={slideoutNewJob}
                >
                  {isMobile ? "" : "Add Job"}
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="reactTrackerPage_tableContainer">
            <MuiTableTest
              jobs={filteredJobs}
              setIsSlideoutOpen={setIsSlideoutOpen}
              selectedJobId={selectedJobId}
              setSelectedJobId={setSelectedJobId}
              deleteJob={deleteJob}
              setIsAddingNewJob={setIsAddingNewJob}
              setIsDeleteModalVisible={setIsDeleteModalVisible}
              isDataLoading={isDataLoading}
              refreshTable={refreshTable}
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
          getLinkedInData={getLinkedInData}
        />
        <Modal
          open={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
        >
          <Box sx={{ ...getModalStyle(theme), p: 2, width: { xs: "90%", sm: 400 } }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                size="small"
                onClick={() => setIsDeleteModalVisible(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography fontWeight="regular" sx={{ my: 2 }}>
              Are you sure you want to delete your
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "error.main", mx: 0.5 }}
              >
                {currentEditingJob?.job_title}
              </Box>
              application to
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "primary.main", mx: 0.5 }}
              >
                {currentEditingJob?.company}
              </Box>
              ?
            </Typography>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  selectedJobId &&
                  deleteJob(selectedJobId).then(() =>
                    setIsDeleteModalVisible(false),
                  )
                }
              >
                Yes
              </Button>

              <Button
                variant="outlined"
                onClick={() => setIsDeleteModalVisible(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default SimpleDashboard;
