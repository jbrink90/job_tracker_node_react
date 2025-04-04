import React from 'react'
import './index.css'
import '@fontsource/ubuntu/400.css';
import { Job } from "../../../../shared/src/types/Job";

interface ReactTableProps {
  toggleSlideoutFunction: () => void;
  jobs: Job[];
  setSelectedJobIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const ReactTable: React.FC<ReactTableProps> = ({ toggleSlideoutFunction, jobs, setSelectedJobIndex }) => {
  return (
    <div className="reactTracker_body">
      <div className="reactTracker_tableContainer">
        <table className="reactTracker_table">
          <thead>
            <tr>
              <th>ID</th>
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
              <tr key={row.id} onClick={() => setSelectedJobIndex(index)}>
                <td>{row.id}</td>
                <td>{row.company}</td>
                <td>{row.job_title}</td>
                <td>{row.description}</td>
                <td>{row.location}</td>
                <td>{row.status}</td>
                <td>{row.applied}</td>
                <td>{row.last_updated}</td>
                <td>
                  <button
                    className="reactTracker_editButton"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents row click event from triggering
                      setSelectedJobIndex(index);
                      toggleSlideoutFunction();
                    }}
                  >
                  </button>
                  <button className="reactTracker_delButton"></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReactTable
