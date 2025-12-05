import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "@fontsource/roboto/400.css";
import { Job } from "@mytypes/Job";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import "./index.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1d1d1d" },
  },
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#3E3E3E",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "7px",
};

interface ReactTableProps {
  selectedJobId: number | null;
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSlideoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobs: Job[];
  deleteJob: (arg: number) => void;
  setIsAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
}


export const MuiTableTest: React.FC<ReactTableProps> = ({ jobs, setIsSlideoutOpen, setIsAddingNewJob, selectedJobId, setSelectedJobId, deleteJob }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const openDeleteModal = () => setIsDeleteModalVisible(true);
  const closeDeleteModal = () => setIsDeleteModalVisible(false);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", sortable: true, filterable: true, type: "number", flex: 0.2 },
    { field: "company", headerName: "Company", flex: 1, sortable: true, filterable: true },
    { field: "job_title", headerName: "Job Title", flex: 1, sortable: true, filterable: true },
    { field: "location", headerName: "Location", flex: 1, sortable: true, filterable: true },
    { field: "status", headerName: "Status", flex: 1, sortable: true, filterable: true },
    {
      field: "applied",
      headerName: "Applied",
      flex: 1,
      sortable: true,
      filterable: true,
      type: "date",
    },
    {
      field: "last_updated",
      headerName: "Last Updated",
      flex: 1,
      sortable: true,
      filterable: true,
      type: "date",
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      hideable: false,
      align: 'center',
      renderCell: (params) => (
        <>
        <button
          style={{backgroundColor: '#00bffe', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJobId(params.row.id);
            setIsAddingNewJob(false);
            setIsSlideoutOpen(true);
          }}
        >
          Edit
        </button>
        <button 
          style={{backgroundColor: '#00bffe', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px'}}
          onClick={(e) => {
            setSelectedJobId(params.row.id);
            e.stopPropagation();
            openDeleteModal();
            // if (window.confirm(`Are you sure you want to delete job ID ${params.row.id}?`)) {
            //   deleteJob(params.row.id);
            //   console.log(`Delete job ID ${params.row.id}`);
            // }
          }}
          >
            Delete
          </button>
        </>
      )
    },
  ];

  const formattedJobs = jobs.map(job => ({
    id: job.id,
    ...job,
    applied: job.applied ? new Date(job.applied) : null,
    last_updated: job.last_updated ? new Date(job.last_updated) : null,
  }));

  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={12}>
        <DataGrid
          rows={formattedJobs}
          columns={columns}
          sx={{ display: 'flex', flexDirection: 'column'}}
        />
      </Paper>
    </ThemeProvider>
    
    <Modal open={isDeleteModalVisible} onClose={closeDeleteModal}>
        <Box sx={modalStyle} style={{ padding: "10px" }}>
          <CloseIcon fontSize="small" onClick={closeDeleteModal} />
          <h2 className="editSlideout_modal-message">Are you sure you want to delete job with ID '{selectedJobId}'?</h2>
          <button
            className="editSlideout_modal-button"
            onClick={() => selectedJobId && (deleteJob(selectedJobId), closeDeleteModal(), true)}
          >
            Yes
          </button>
          <button
            className="editSlideout_modal-button"
            onClick={closeDeleteModal}
          >
            Cancel
          </button>
        </Box>
      </Modal>
    </>

  );
}
export default MuiTableTest;
