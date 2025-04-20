import React, { useState } from "react";
import "./index.css";
import "@fontsource/ubuntu/400.css";
import { Job } from "../../../../shared/src/types/Job";
import dayjs from "dayjs";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface ReactTableProps {
  slideIn: () => void;
  jobs: Job[];
  setSelectedJobIndex: React.Dispatch<React.SetStateAction<number>>;
  deleteJob: (arg: number) => void;
  setAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#3E3E3E",
  border: "1px solid #000",
  boxShadow: "5px 5px 10px #00000057",
  borderRadius: "7px",
};

const ReactTable: React.FC<ReactTableProps> = ({
  slideIn,
  jobs,
  setSelectedJobIndex,
  deleteJob,
  setAddingNewJob,
}) => {
  const [isSaveModalVisible, setIsSaveModalVisible] = useState<boolean>(false);
  const [jobIndexToDelete, setJobIndexToDelete] = useState<number>(-1);

  const openSaveModal = () => setIsSaveModalVisible(true);
  const closeSaveModal = () => setIsSaveModalVisible(false);

  return (
    <>
      <table className="reactTracker_table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Description</th>
            <th>Location</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="reactTracker_tableBody">
          {jobs.map((row, index) => (
            <tr
              key={`${index}9`}
              style={{ cursor: "pointer" }}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.getSelection()?.removeAllRanges();
                setAddingNewJob(false);
                setSelectedJobIndex(index);
                slideIn();
              }}
            >
              <td>{row ? row.company : ""}</td>
              <td>{row ? row.job_title : ""}</td>
              <td>{row ? row.description.substring(0, 40) : ""}</td>
              <td>{row ? row.location : ""}</td>
              <td>{row ? row.status : ""}</td>
              <td>
                {row?.applied
                  ? dayjs(row.applied).format("MM/DD/YYYY")
                  : ""}
              </td>
              <td>
                {row?.last_updated
                  ? dayjs(row.last_updated).format("MM/DD/YYYY")
                  : ""}
              </td>
              <td>
                <Tooltip title={`Edit ${row.job_title.substring(0, 25)}`}>
                  <span
                    className="reactTracker_editButton"
                    onClick={(e) => {
                      setAddingNewJob(false);
                      e.stopPropagation();
                      setSelectedJobIndex(index);
                      slideIn();
                    }}
                  >
                    <EditDocumentIcon sx={{ color: "#0087ff" }} />
                  </span>
                </Tooltip>
                <Tooltip title={`Delete ${row.job_title.substring(0, 25)}`}>
                  <span
                    className="reactTracker_delButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      setJobIndexToDelete(index);
                      openSaveModal();
                    }}
                  >
                    <DeleteIcon sx={{ color: "#0087ff" }} />
                  </span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={isSaveModalVisible} onClose={closeSaveModal}>
        <Box
          sx={modalStyle}
          style={{
            padding: "10px",
          }}
        >
          <CloseIcon fontSize="small" onClick={closeSaveModal} />
          <h2 className="reactTracker_modal-message">
            Really delete application?
          </h2>
          <div className="reactTracker_modal-buttonDiv">
            <button
              className="reactTracker_modal-button"
              onClick={() => {
                deleteJob(jobIndexToDelete);
                setJobIndexToDelete(-1);
                closeSaveModal();
              }}
            >
              Yes
            </button>
            <button
              className="reactTracker_modal-button"
              onClick={closeSaveModal}
            >
              No
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ReactTable;
