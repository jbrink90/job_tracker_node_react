import React from "react";
import "./index.css";
import "@fontsource/ubuntu/400.css";
import { Job } from "../../../../shared/src/types/Job";
import dayjs from "dayjs";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import DeleteIcon from '@mui/icons-material/Delete';

interface ReactTableProps {
  slideIn: () => void;
  jobs: Job[];
  setSelectedJobIndex: React.Dispatch<React.SetStateAction<number>>;
  deleteJob: (arg: number) => void;
  setAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReactTable: React.FC<ReactTableProps> = ({
  slideIn,
  jobs,
  setSelectedJobIndex,
  deleteJob,
  setAddingNewJob,
}) => {
  return (
    <div className="reactTracker_body">
      <div className="reactTracker_tableContainer">
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
              <tr key={row ? row.id : 0}>
                <td>{row ? row.company : ""}</td>
                <td>{row ? row.job_title : ""}</td>
                <td>{row ? row.description.substring(0,40) : ""}</td>
                <td>{row ? row.location : ""}</td>
                <td>{row ? row.status : ""}</td>
                <td>{row?.applied ? dayjs(row.applied).format("MM/DD/YYYY") : ""}</td>
                <td>{row?.last_updated ? dayjs(row.last_updated).format("MM/DD/YYYY") : ""}</td>
                <td>
                  <span
                    className="reactTracker_editButton"
                    onClick={(e) => {
                      setAddingNewJob(false);
                      e.stopPropagation();
                      setSelectedJobIndex(index);
                      slideIn();
                    }}
                  ><EditDocumentIcon /></span>
                  <span
                    className="reactTracker_delButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJob(index);
                    }}
                  ><DeleteIcon /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReactTable;
