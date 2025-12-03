import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "@fontsource/roboto/400.css";
import { Job } from "@mytypes/Job";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1d1d1d" },
  },
});

interface ReactTableProps {
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>;
  slideIn: () => void;
  jobs: Job[];
  setSelectedJobIndex: React.Dispatch<React.SetStateAction<number>>;
  deleteJob: (arg: number) => void;
  setAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
}


export const MuiTableTest: React.FC<ReactTableProps> = ({ jobs, slideIn, setAddingNewJob, setSelectedJobId }) => {

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "company", headerName: "Company", flex: 1, sortable: true, filterable: true },
    { field: "job_title", headerName: "Job Title", flex: 1, sortable: true, filterable: true },
    { field: "description", headerName: "Description", flex: 2, sortable: true, filterable: true },
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
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAddingNewJob(false);
            setSelectedJobId(params.row.id); // now correct
            slideIn();
          }}
        >
          Edit
        </button>
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
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={12}>
        <DataGrid rows={formattedJobs} columns={columns} sx={{ display: 'flex', flexDirection: 'column'}} />
      </Paper>
    </ThemeProvider>
  );
}
export default MuiTableTest;
