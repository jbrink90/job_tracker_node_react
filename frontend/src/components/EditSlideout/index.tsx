import React, { useEffect, useState } from "react";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";
import { Job } from "@mytypes/Job";

interface EditSlideoutProps {
  job: Job;
  masterJobList: Job[];
  setMasterJobList: React.Dispatch<React.SetStateAction<Job[]>>;
  slideOut: () => void;
  addingNewJob: boolean;
}
const defaultJob: Job = {
  id: 0,
  company: '',
  job_title: '',
  description: '',
  location: '',
  status: '',
  applied: '',
  last_updated: ''
};

const EditSlideout: React.FC<EditSlideoutProps> = ({
  slideOut,
  job,
  masterJobList,
  setMasterJobList,
}) => {
  
  const [jobValues, setJobValues] = useState<Job>(defaultJob);
  const [hasJobBeenModified, setHasJobBeenModified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const toggleLocalSlideout = () => {
    if (hasJobBeenModified) {
      setIsModalVisible(true);
    } else {
      slideOut();
    }
  };

  useEffect(() => {
    setJobValues(job || defaultJob);
  }, [job]);

  const discardChanges = () => {
    setJobValues(job);
    setHasJobBeenModified(false);
    slideOut();
    setIsModalVisible(false);
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
    setIsModalVisible(false);
    slideOut();
    setMasterJobList(
      masterJobList.map((item) => (item.id === jobValues.id ? jobValues : item))
    );
    setHasJobBeenModified(false);
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
          <header className="editSlideout_header">Edit Application</header>

          <label>Company</label>
          <input
            type="text"
            name="company"
            value={jobValues.company ? jobValues.company : ''}
            onChange={handleInputChange}
          />

          <label>Position</label>
          <input
            type="text"
            name="job_title"
            value={jobValues.job_title ? jobValues.job_title : ''}
            onChange={handleInputChange}
          />

          <label>Description</label>
          <textarea
            rows={10}
            name="description"
            value={jobValues.description ? jobValues.description : ''}
            onChange={handleInputChange}
          ></textarea>

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={jobValues.location ? jobValues.location : ''}
            onChange={handleInputChange}
          />

          <label>Status</label>
          <input
            type="text"
            name="status"
            value={jobValues.status ? jobValues.status : ''}
            onChange={handleInputChange}
          />

          <label>Date Applied</label>
          <input
            type="text"
            name="applied"
            value={jobValues.applied ? jobValues.applied?.toString() : ''}
            onChange={handleInputChange}
          />

          <label>Last Update</label>
          <span className="editSlideout_span">
            {jobValues.last_updated
              ? jobValues.last_updated?.toString()
              : "04/02/2024 12:07 AM"}
          </span>
          <button
            style={{ marginTop: "15px", height: "40px" }}
            onMouseUp={saveApplication}
          >
            Save Application
          </button>
        </div>
      </aside>
      {isModalVisible && (
        <div id="myModal" className="editSlideout_modal">
          <div className="editSlideout_modal-content">
            <span
              className="editSlideout_close"
              onClick={() => setIsModalVisible(false)}
            >
              &times;
            </span>
            <p>Save your changes?</p>
            <button onClick={saveApplication}>Yes, save them.</button>
            <button onClick={discardChanges}>No, discard them.</button>
            <button
              onClick={() => {
                setIsModalVisible(false);
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
