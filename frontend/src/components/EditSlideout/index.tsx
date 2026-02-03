import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import { Job } from "../../types/Job";
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
} from "@mui/material";
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
  MDXEditorMethods
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from '@mui/material';


interface EditSlideoutProps {
  isSlideoutOpen: boolean;
  setIsSlideoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentEditingJob: Job;
  isAddingNewJob: boolean;
  addJob: (jobValues: Job) => void;
  saveJob: (jobValues: Job) => void;
  onSaveJob: (jobValues: Job) => void;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#333",
  border: "1px solid #000",
  boxShadow: 24,
  borderRadius: "7px",
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
}) => {
  const [jobValues, setJobValues] = useState<Job>(currentEditingJob);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const [markdownSource, setMarkdownSource] = useState<string>("");

   useEffect(() => {
    if (!isSlideoutOpen) return;

    if (isAddingNewJob) {
      setJobValues(defaultJob);
      setMarkdownSource("");
      editorRef.current?.setMarkdown("");

    } else {
      setJobValues(currentEditingJob || defaultJob);
      setMarkdownSource(currentEditingJob?.description || "");
    
      editorRef.current?.setMarkdown(
        currentEditingJob?.description || ""
      );
    }
    setHasJobBeenModified(false);
  }, [currentEditingJob, isAddingNewJob, isSlideoutOpen]);

  const toggleLocalSlideout = () => {
    if (hasJobBeenModified) {
      setIsSaveModalVisible(true);
    } else {
      setIsSlideoutOpen(false);
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

  const handleEditorMarkdownChange = (
    newMarkdown: string,
    isInitial: boolean
  ) => {
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
    closeSaveModal();
  };

  const saveApplication = () => {
    closeSaveModal();

    if (isAddingNewJob) {
      try {
        addJob(jobValues);
        setJobValues(defaultJob);
        setIsSlideoutOpen(false);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        saveJob(jobValues);
        setHasJobBeenModified(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isSlideoutOpen}
        onClose={toggleLocalSlideout}
        slotProps={{
            paper: {
              sx: {
                width: { xs: "100%", sm: 500 },
                bgcolor: "#222",
                color: "grey.100",
                p: 3,
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

          {!isAddingNewJob && (
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

        <Stack spacing={2}>
          <TextField
            label="Company"
            name="company"
            value={jobValues?.company || ""}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Position"
            name="job_title"
            value={jobValues?.job_title || ""}
            onChange={handleInputChange}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Description
            </Typography>
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

          <TextField
            label="Location"
            name="location"
            value={jobValues?.location || ""}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <MapIcon
                  sx={{ cursor: "pointer" }}
                  onClick={openMapModal}
                />
              ),
            }}
          />

          <TextField
            label="Status"
            name="status"
            value={jobValues?.status || ""}
            onChange={handleInputChange}
            fullWidth
          />

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
            slotProps={{ textField: { fullWidth: true } }}
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

        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onSaveJob(jobValues)}
            disabled={!hasJobBeenModified}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {isAddingNewJob ? "Add Job" : "Save Job"}
          </Button>
        </Box>
      </Drawer>

      <Modal open={isSaveModalVisible} onClose={closeSaveModal}>
        <Box sx={{ ...modalStyle, width: { xs: "90%", sm: 400 } }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={closeSaveModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            Save your changes?
          </Typography>

          <Stack direction="row" spacing={2} mb={2} justifyContent="center">
            <Button variant="contained" onClick={saveApplication}>
              Yes
            </Button>
            <Button variant="contained" color="error" onClick={discardChanges}>
              No
            </Button>
            <Button variant="outlined" onClick={closeSaveModal}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={isMapModalVisible} onClose={closeMapModal}>
        <Box sx={{ ...modalStyle, p: 3 }}>
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
};

export default EditSlideout;
