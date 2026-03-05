import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import "../../pages/Login/index.css";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import { Job } from "../../types/Job";

type LinkedInJobResponse = {
  success: boolean;
  job?: {
    job_title: string;
    company: string;
    location: string;
    description: string;
  };
  error?: string;
  details?: string;
}
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SearchableMap from "../SearchableMap";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Modal,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from 'notistack';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  imagePlugin,
  InsertImage,
  ListsToggle,
  MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@mui/material";

interface EditSlideoutProps {
  isSlideoutOpen: boolean;
  setIsSlideoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentEditingJob: Job;
  isAddingNewJob: boolean;
  addJob: (jobValues: Job) => void;
  saveJob: (jobValues: Job) => void;
  onSaveJob: (jobValues: Job) => void;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getLinkedInData: (linkedInUrl: string) => Promise<LinkedInJobResponse>;
}

const defaultJob: Job = {
  company: "",
  job_title: "",
  description: "",
  location: "",
  status: "Applied",
  applied: new Date(),
  last_updated: new Date(),
  supabase_id: "",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: 24,
  borderRadius: "7px",
  p: 3,
};

const EditSlideout: React.FC<EditSlideoutProps> = ({
  setIsSlideoutOpen,
  isSlideoutOpen,
  currentEditingJob,
  isAddingNewJob,
  addJob,
  saveJob,
  onSaveJob,
  setIsDeleteModalVisible,
  getLinkedInData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  
  const [jobValues, setJobValues] = useState<Job>(currentEditingJob);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const editorRef = useRef<MDXEditorMethods>(null);
  const [markdownSource, setMarkdownSource] = useState<string>("");
  const [showLinkedInDiv, setShowLinkedInDiv] = useState(true);
  const [loadingLinkedIn, setLoadingLinkedIn] = useState(false);

  useEffect(() => {
    if (!isSlideoutOpen) return;

    if (isAddingNewJob) {
      setLinkedinUrl("")
      setJobValues(defaultJob);
      setMarkdownSource("");
      editorRef.current?.setMarkdown("");
    } else {
      setJobValues(currentEditingJob || defaultJob);
      setMarkdownSource(currentEditingJob?.description || "");
      editorRef.current?.setMarkdown(currentEditingJob?.description || "");
      setShowLinkedInDiv(false);
    }
    setHasJobBeenModified(false);
  }, [currentEditingJob, isAddingNewJob, isSlideoutOpen]);

  const toggleLocalSlideout = () => {
    if (hasJobBeenModified) {
      setIsSaveModalVisible(true);
    } else {
      setIsSlideoutOpen(false);
      setShowLinkedInDiv(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobValues((prev) => ({ ...prev, [name]: value }));
    setHasJobBeenModified(true);
  };

  const openMapModal = () => setIsMapModalVisible(true);
  const closeMapModal = () => setIsMapModalVisible(false);
  const closeSaveModal = () => setIsSaveModalVisible(false);

  const handleEditorMarkdownChange = (newMarkdown: string, isInitial: boolean) => {
    if (!isInitial) {
      setMarkdownSource(newMarkdown);
      setJobValues((prev) => ({
        ...prev,
        description: newMarkdown,
      }));
      setHasJobBeenModified(true);
    }
  };

  const discardChanges = () => {
    setJobValues({ ...currentEditingJob });
    setMarkdownSource(currentEditingJob.description || "");
    setHasJobBeenModified(false);
    setIsSlideoutOpen(false);
    setShowLinkedInDiv(true);
    closeSaveModal();
  };

  const handleDirectSave = () => {
    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      enqueueSnackbar(
        `Please fill in the required fields: ${missingFields.join(', ')}`, 
        { variant: 'error' }
      );
      return;
    }
    
    onSaveJob(jobValues);
  };

  const validateRequiredFields = (): string[] => {
    const missingFields: string[] = [];
    
    if (!jobValues.company?.trim()) {
      missingFields.push('Company');
    }
    if (!jobValues.job_title?.trim()) {
      missingFields.push('Position');
    }
    if (!jobValues.location?.trim()) {
      missingFields.push('Location');
    }
    if (!jobValues.status?.trim()) {
      missingFields.push('Status');
    }
    if (!jobValues.applied) {
      missingFields.push('Date Applied');
    }
    
    return missingFields;
  };

  const saveApplication = () => {
    closeSaveModal();

    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      enqueueSnackbar(
        `Please fill in the required fields: ${missingFields.join(', ')}`, 
        { variant: 'error' }
      );
      return;
    }

    if (isAddingNewJob) {
      try {
        addJob(jobValues);
        setJobValues(defaultJob);
        setIsSlideoutOpen(false);
        setShowLinkedInDiv(true);
      } catch (error) {
        enqueueSnackbar("Failed to add job. Please try again.", { variant: "error" });
      }
    } else {
      try {
        saveJob(jobValues);
        setHasJobBeenModified(false);
      } catch (error) {
        enqueueSnackbar("Failed to save job. Please try again.", { variant: "error" });
      }
    }
  };

  function handleImport() {
    setLoadingLinkedIn(true);
    
    getLinkedInData(linkedinUrl)
      .then((data: LinkedInJobResponse) => {
        if (data.success && data.job) {
          setJobValues(prev => ({
            ...prev,
            job_title: data.job!.job_title,
            company: data.job!.company,
            location: data.job!.location,
            description: data.job!.description,
          }));
          setMarkdownSource(data.job!.description);
          setHasJobBeenModified(true);
          
          setShowLinkedInDiv(false);
        } 
        
        if (data.details) {
          switch (data.details) {
            case "Request failed with status code 404":
              enqueueSnackbar("Job not found. Please check the URL and try again.", { variant: "error" });
              break;
            
            default:
              enqueueSnackbar("Failed to import from LinkedIn. Please check the URL and try again.", { variant: "error" });
              break;
          }
        }
      })
      .catch((error: any) => {
        console.error("LinkedIn import error:", error);
        enqueueSnackbar("Failed to import from LinkedIn. Please check the URL and try again.", { variant: "error" });
        setLoadingLinkedIn(false);
      });
  }

  if (showLinkedInDiv) {
    return (
    <>
      <Drawer
        anchor="right"
        open={isSlideoutOpen}
        onClose={toggleLocalSlideout}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: "85%", md: "600px" },
              color: theme.palette.text.primary,
              borderLeft: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[16],
              bgcolor: theme.palette.background.default,
              padding: "20px",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={toggleLocalSlideout}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600 }}>
            Add Job
          </Typography>
          
          
          <Typography variant="body2" sx={{ marginBottom: 3, color: 'text.secondary' }}>
            Enter a LinkedIn job posting URL to automatically import job details
          </Typography>
          
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="https://www.linkedin.com/jobs/view/..."
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: 2 }}
            size="small"
            disabled={loadingLinkedIn}
          />
          
          <Button
            variant="contained"
            fullWidth
            disabled={!linkedinUrl || !linkedinUrl.includes('linkedin.com/jobs/view/') || loadingLinkedIn}
            onClick={handleImport}
          >
            Import from LinkedIn
          </Button>
          
          {loadingLinkedIn && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                borderRadius: 1
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
          
          <div className="or-divider">OR</div>
          
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowLinkedInDiv(false)}
          >
            Enter posting manually
          </Button>
        </Box>
      </Drawer>
    </>
    );
  } else {
      return (
    <>
      <Drawer
        anchor="right"
        open={isSlideoutOpen}
        onClose={toggleLocalSlideout}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: "85%", md: "600px" },
              color: theme.palette.text.primary,
              borderLeft: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[16],
              bgcolor: theme.palette.background.default,
              padding: "20px",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={toggleLocalSlideout}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {isAddingNewJob ? "Add Job" : "Edit Job"}
          </Typography>

          {isMobile && !isAddingNewJob && (
            <Button
              color="error"
              variant="contained"
              sx={{ minWidth: "100px", height: "35px" }}
              onClick={() => setIsDeleteModalVisible(true)}
            >
              Delete Job
            </Button>
          )}
        </Box>

        <Stack spacing={2.5}>
          <TextField label="Company" name="company" value={jobValues?.company || ""} onChange={handleInputChange} fullWidth required />
          <TextField label="Position" name="job_title" value={jobValues?.job_title || ""} onChange={handleInputChange} fullWidth required />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Description
            </Typography>

            <Box>
              <MDXEditor
                ref={editorRef}
                key={`${isAddingNewJob ? "new" : jobValues.id}`}
                markdown={markdownSource}
                onChange={handleEditorMarkdownChange}
                contentEditableClassName="editSlideout_mdxeditor_text"
                plugins={[
                  imagePlugin(),
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  toolbarPlugin({
                    toolbarClassName: "editSlideout_mdxeditor_toolbar",
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <ListsToggle />
                        <InsertImage />
                      </>
                    ),
                  }),
                ]}
              />
            </Box>
          </Box>

          <TextField
            label="Location"
            name="location"
            value={jobValues?.location || ""}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <MapIcon sx={{ cursor: "pointer" }} onClick={openMapModal} />
              ),
            }}
          />

          <TextField label="Status" name="status" value={jobValues?.status || ""} onChange={handleInputChange} fullWidth required />

          <DatePicker
            label="Date Applied"
            value={jobValues?.applied ? dayjs(jobValues.applied) : dayjs()}
            onChange={(value) => {
              setJobValues((prev) => ({
                ...prev,
                applied: value ? value.toDate() : new Date(),
              }));
              setHasJobBeenModified(true);
            }}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />

          <TextField
            label="Last Update"
            value={
              jobValues?.last_updated
                ? dayjs(jobValues.last_updated).format("MM/DD/YYYY")
                : ""
            }
            disabled
            fullWidth
          />
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDirectSave}
            disabled={!hasJobBeenModified}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            {isAddingNewJob ? "Add Job" : "Save Job"}
          </Button>
        </Box>
      </Drawer>

      <Modal open={isSaveModalVisible} onClose={closeSaveModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={closeSaveModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
            Save your changes?
          </Typography>

          <Stack direction="row" spacing={2} mb={2} justifyContent="center">
            <Button variant="contained" onClick={saveApplication}>
              Yes
            </Button>
            <Button variant="contained" color="error" onClick={discardChanges}>
              No
            </Button>
            <Button variant="contained" color="warning" onClick={closeSaveModal}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={isMapModalVisible} onClose={closeMapModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={closeMapModal}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
          <SearchableMap />
        </Box>
      </Modal>
    </>
  );
  }


};

export default EditSlideout;