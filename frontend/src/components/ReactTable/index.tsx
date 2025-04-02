import React, { useEffect } from 'react'
import './index.css'
import '@fontsource/ubuntu/400.css';
import { Job } from "../../../../shared/src/types/Job";

interface ReactTableProps {
  toggleSlideoutFunction: Function;
  jobs: Job[];
}
const ReactTable: React.FC<ReactTableProps> =({ toggleSlideoutFunction, jobs }) => {

  useEffect(() => { 
    const ourTableBody = document.querySelector(".reactTracker_tableBody") as HTMLTableSectionElement;

    jobs.forEach(row => {
      const newRow = document.createElement("tr");
      const columnOrder = ["id", "company", "job_title", "description", "location", "status", "applied", "last_updated"];

      columnOrder.forEach(column => {
        const newCol = document.createElement("td");
        newCol.textContent = String(row[column as keyof typeof row]);
        newRow.appendChild(newCol);
      });

      const actionsCol = document.createElement("td");
      const editButton = document.createElement("button");
      const delButton = document.createElement("button");

      editButton.className = "reactTracker_editButton"
      editButton.onclick = (() => {toggleSlideoutFunction()});

      actionsCol.appendChild(editButton);
      delButton.className = "reactTracker_delButton";
      actionsCol.appendChild(delButton);
      newRow.appendChild(actionsCol);
      ourTableBody.appendChild(newRow);
    });  }, [jobs]);

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
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReactTable
