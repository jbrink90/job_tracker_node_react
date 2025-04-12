import React, { useEffect, useState } from "react";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";
import { Job } from "@mytypes/Job";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface EditSlideoutProps {
  job: Job;
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

const EditSlideout: React.FC<EditSlideoutProps> = ({
  slideOut,
  job,
  masterJobList,
  setMasterJobList,
  addingNewJob,
  addJob,
  saveJob,
}) => {
  const [jobValues, setJobValues] = useState<Job>(defaultJob);
  const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState<boolean>(false);

  const toggleLocalSlideout = () => {
    if (hasJobBeenModified) {
      setIsSaveModalVisible(true);
    } else {
      slideOut();
    }
  };

  useEffect(() => {
    if (addingNewJob) {
      setJobValues(defaultJob);
    } else {
      setJobValues(job || defaultJob);
    }
  }, [job, addingNewJob, addJob]);

  const discardChanges = () => {
    setJobValues(job);
    setHasJobBeenModified(false);
    slideOut();
    setIsSaveModalVisible(false);
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
    setIsSaveModalVisible(false);

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
        slideOut();
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
          <input
            type="text"
            name="location"
            value={jobValues ? jobValues.location : ""}
            onChange={handleInputChange}
          />

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

      {isSaveModalVisible && (
        <div id="myModal" className="editSlideout_modal">
          <div className="editSlideout_modal-content">
            <span
              className="editSlideout_modal-close"
              onClick={() => setIsSaveModalVisible(false)}
            >
              &times;
            </span>
            <h2 className="editSlideout_modal-message">Save your changes?</h2>
            <button className="editSlideout_modal-button"onClick={saveApplication}>Yes</button>
            <button className="editSlideout_modal-button"onClick={discardChanges}>No</button>
            <button
              className="editSlideout_modal-button"
              onClick={() => {
                setIsSaveModalVisible(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default EditSlideout;
