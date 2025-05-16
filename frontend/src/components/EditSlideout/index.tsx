import React, { useEffect, useState } from "react";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from '@mui/icons-material/Map';
import { Job } from "@mytypes/Job";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SearchableMap from "../SearchableMap";

interface EditSlideoutProps {
  currentEditingJob: Job;
  masterJobList: Job[];
  setMasterJobList: React.Dispatch<React.SetStateAction<Job[]>>;
  slideOut: () => void;
  addingNewJob: boolean;
  addJob: (jobValues: Job) => void;
  saveJob: (jobValues: Job) => void;
}

const defaultJob: Job = {
  company: "",
  job_title: "",
  description: "",
  location: "",
  status: "",
  applied: new Date(),
  last_updated: new Date(),
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#3E3E3E',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '7px'
};

const EditSlideout: React.FC<EditSlideoutProps> = ({
  slideOut,
  currentEditingJob,
  masterJobList,
  setMasterJobList,
  addingNewJob,
  addJob,
  saveJob,
}) => {
  const [jobValues, setJobValues] = useState<Job>(defaultJob);
  const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState<boolean>(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState<boolean>(false);

  const openMapModal = () => setIsMapModalVisible(true);
  const closeMapModal = () => setIsMapModalVisible(false);
  const openSaveModal = () => setIsSaveModalVisible(true);
  const closeSaveModal = () => setIsSaveModalVisible(false);

  const toggleLocalSlideout = () => {
    if (hasJobBeenModified) {
      openSaveModal();
    } else {
      slideOut();
    }
  };

  useEffect(() => {
    if (addingNewJob) {
      setJobValues(defaultJob);
    } else {
      if (hasJobBeenModified) {
        openSaveModal();
      } else {
        setJobValues(currentEditingJob || defaultJob);
      }
    }
  }, [currentEditingJob, addingNewJob, addJob]);

  const discardChanges = () => {
    setJobValues(currentEditingJob);
    setHasJobBeenModified(false);
    slideOut();
    closeSaveModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobValues((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
    setHasJobBeenModified(true);
  };

  const saveApplication = () => {
    closeSaveModal();

    if (addingNewJob) {
      try {
        addJob(jobValues);
        setJobValues(defaultJob);
        slideOut();
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        setMasterJobList(
          masterJobList.map((item) =>
            item.id === jobValues.id ? jobValues : item
          )
        );
        saveJob(jobValues);
        setHasJobBeenModified(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <aside className="editSlideout_container">
        <div className="editSlideout_navRow">
          <CloseIcon
            fontSize="large"
            onClick={() => {
              toggleLocalSlideout();
            }}
          />
        </div>
        <div className="editSlideout_content">
          <header className="editSlideout_header">
            {addingNewJob ? "Add Job" : "Edit Job"}
          </header>

          <label>Company</label>
          <input
            type="text"
            name="company"
            value={jobValues ? jobValues.company : ""}
            onChange={handleInputChange}
          />

          <label>Position</label>
          <input
            type="text"
            name="job_title"
            value={jobValues ? jobValues.job_title : ""}
            onChange={handleInputChange}
          />

          <label>Description</label>
          <textarea
            rows={10}
            name="description"
            value={jobValues ? jobValues.description : ""}
            onChange={handleInputChange}
          ></textarea>

          <label>Location</label>
          <div className="editSlideout_locationDiv">
            <input
              type="text"
              name="location"
              value={jobValues ? jobValues.location : ""}
              onChange={handleInputChange}
              className="editSlideout_locationInput"
            />
            <MapIcon className="editSlideout_mapIcon" onClick={openMapModal} />
          </div>

          <label>Status</label>
          <input
            type="text"
            name="status"
            value={jobValues ? jobValues.status : ""}
            onChange={handleInputChange}
          />
          

          <label>Date Applied</label>
            <DatePicker
              value={
                jobValues ? dayjs(jobValues.applied?.toString()) : dayjs()
              }
              defaultValue={dayjs()}
              onChange={(value) => {
                jobValues.applied = value ? new Date(value.format("MM/DD/YYYY")) : new Date();
              }}
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiInputAdornment-root .MuiIconButton-root': {
                      color: 'white',
                    },
                    input: {
                      color: 'white',
                      borderColor: 'grey'
                    },
                  }
                }
              }}
            />
          <label>Last Update</label>
          <span className="editSlideout_span">
            {jobValues?.last_updated ? dayjs(jobValues.last_updated).format("MM/DD/YYYY") : ""}
          </span>
        </div>
        <div className="editSlideout_saveDiv">
          <button
            className="editSlideout_saveButton"
            onClick={saveApplication}
          >
            {addingNewJob ? "Add Job" : "Save Job"}
          </button>
        </div>
      </aside>


      <Modal
        open={isSaveModalVisible}
        onClose={closeSaveModal}
      >
        <Box sx={modalStyle} style={{padding:'10px'}}>
          <CloseIcon
              fontSize="small"
              onClick={closeSaveModal}
            />
            <h2 className="editSlideout_modal-message">Save your changes?</h2>
            <button className="editSlideout_modal-button"onClick={saveApplication}>Yes</button>
            <button className="editSlideout_modal-button"onClick={discardChanges}>No</button>
            <button
              className="editSlideout_modal-button"
              onClick={closeSaveModal}
            >
              Cancel
            </button>
        </Box>
      </Modal>

      <Modal
        open={isMapModalVisible}
        onClose={closeMapModal}
      >
        <Box sx={modalStyle}>
        <CloseIcon
            fontSize="large"
            onClick={() => {
              closeMapModal();
            }}
          />
          <SearchableMap />
        </Box>
      </Modal>

    </>
  );
};

export default EditSlideout;
