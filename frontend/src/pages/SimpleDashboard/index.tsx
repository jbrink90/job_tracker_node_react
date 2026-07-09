import { useEffect, useState, useCallback, useMemo } from "react";
import EditSlideout from "../../components/EditSlideout";
import { NewNavBar } from "../../components";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Job } from "../../types/Job";
import { LinkedInJobResponse } from "../../components/EditSlideout";
import Tooltip from "@mui/material/Tooltip";
import { MuiTableTest } from "../../components/MuiTableTest";
import "./index.css";
import {
  apiGetJobsSupabase,
  apiDeleteJobSupabase,
  apiUpdateJobSupabase,
  apiAddJobSupabase,
  apiPullLinkedInDataSupabase,
} from "../../lib/api_calls";
import { supabase, getCurrentUser } from "../../lib/supabase";
import CloseIcon from "@mui/icons-material/Close";
import { PageFooter } from "../../components";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Theme } from "@mui/material/styles";

const getModalStyle = (theme: Theme) => ({
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

const SimpleDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [masterJobList, setMasterJobList] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const defaultJob: Job = useMemo(
    () => ({
      company: "",
      jobTitle: "",
      description: "",
      location: "",
      status: "Applied",
      applied: new Date(),
      lastUpdated: new Date(),
      userId: "",
      createdAt: new Date(),
    }),
    [],
  );
  const [currentEditingJob, setCurrentEditingJob] = useState<Job | null>(
    defaultJob,
  );
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [, setRefreshTableTrigger] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();

  const getAllJobsSupabase = useCallback(
    async (resetPagination: boolean = false) => {
      try {
        setIsDataLoading(true);
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
          throw new Error("No user found");
        }
        const jobs = await apiGetJobsSupabase(currentUser.id);
        setMasterJobList(jobs);
        setIsDataLoading(false);
        if (resetPagination) {
          setRefreshTableTrigger((prev) => prev + 1);
        }
      } catch (error) {
        setIsDataLoading(false);
        console.error(error);
        enqueueSnackbar("Failed to fetch jobs. Please try again.", {
          variant: "error",
        });
      }
    },
    [],
  );

  const deleteJob = async (jobId: string) => {
    if (!accessToken) return;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return;

    try {
      await apiDeleteJobSupabase(jobId, currentUser.id);
      getAllJobsSupabase();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete job. Please try again.", {
        variant: "error",
      });
    }
  };

  const addJob = async (job: Job) => {
    if (!accessToken) return;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return;
    
    job.lastUpdated = new Date();
    job.createdAt = new Date();
    job.userId = currentUser.id;
    
    try {
      const insertedJob = await apiAddJobSupabase(job);
      setMasterJobList((prev) => [...prev, insertedJob]);
      setIsSlideoutOpen(false);
      setIsDeleteModalVisible(false);
      setSelectedJobId(null);
      showToast("Job added successfully.", "success")();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add job. Please try again.", {
        variant: "error",
      });
    }
  };

  const updateJob = async (job: Job) => {
    if (!accessToken) return;
    job.lastUpdated = new Date();

    try {
      await apiUpdateJobSupabase(job);
      setMasterJobList(
        masterJobList.map((item) =>
          item.id === job.id ? job : item,
        ),
      );
      setIsSlideoutOpen(false);
      showToast("Job saved successfully.", "success")();

    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save job. Please try again.", {
        variant: "error",
      });
    }
  };

  const getLinkedInData = async (url: string): Promise<LinkedInJobResponse> => {
    if (!accessToken) return { success: false, error: "No access token" };

    try {
      return await apiPullLinkedInDataSupabase(url);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to pull LinkedIn job data. Please try again.", {
        variant: "error",
      });
      return { success: false, error: "Failed to fetch data" };
    }
  };

  const onSaveJob = (jobValues: Job) => {
    if (isAddingNewJob) {
      addJob(jobValues);
    } else {
      updateJob(jobValues);
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
    getAllJobsSupabase(true); // Explicitly reset pagination on refresh
  }, [getAllJobsSupabase]);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredJobs = masterJobList.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (job.company || "").toLowerCase().includes(searchLower) ||
      (job.jobTitle || "").toLowerCase().includes(searchLower) ||
      (job.location || "").toLowerCase().includes(searchLower) ||
      (job.status || "").toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
  }, []);

  useEffect(() => {
    if (accessToken) {
      getAllJobsSupabase();
    }
  }, [accessToken, getAllJobsSupabase]);

  useEffect(() => {
    if (selectedJobId == null) {
      setCurrentEditingJob(defaultJob);
      return;
    }

    const job = masterJobList.find((j) => j.id === selectedJobId);
    setCurrentEditingJob(job ?? defaultJob);
  }, [selectedJobId, masterJobList, defaultJob]);

  return (
    <>
      <div className="reactTrackerPage_main">
        <NewNavBar onSearchChange={handleSearchChange} />

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
                    },
                  }}
                  onClick={() => {
                    setIsDataLoading(true);
                    getAllJobsSupabase(true);
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
                    },
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
          saveJob={updateJob}
          onSaveJob={onSaveJob}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
          getLinkedInData={getLinkedInData}
        />
        <Modal
          open={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
        >
          <Box
            sx={{
              ...getModalStyle(theme),
              p: 2,
              width: { xs: "90%", sm: 400 },
            }}
          >
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
                {currentEditingJob?.jobTitle}
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
