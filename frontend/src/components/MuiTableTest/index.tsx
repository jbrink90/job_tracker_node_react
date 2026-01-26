import { DataGrid, GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "@fontsource/roboto/400.css";
import { Job } from "../../types/Job";
import React from "react";
import "./index.css";
import { useTheme, useMediaQuery } from "@mui/material";

interface ReactTableProps {
  selectedJobId: number | null;
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSlideoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobs: Job[];
  deleteJob: (arg: number) => void;
  setIsAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDataLoading: boolean;
}

export const MuiTableTest: React.FC<ReactTableProps> = ({jobs, setIsSlideoutOpen, setIsAddingNewJob, setSelectedJobId, setIsDeleteModalVisible, isDataLoading}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnVisibilityModel, setColumnVisibilityModel] =
  React.useState<GridColumnVisibilityModel>({
    location: false,
    applied: false,
    last_updated: false,
  });

  const desktopColumns: GridColDef[] = [
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
      sortable: false,
      filterable: false,
      hideable: false,
      align: 'center',
      width: isMobile ? 70 : 150,
      renderCell: (params) => (
        <>
        <button
          className='muiTableTest_button'
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJobId(params.row.id);
            setIsAddingNewJob(false);
            setIsSlideoutOpen(true);
          }}
        >
          Edit
        </button>
        { !isMobile && <button 
          className='muiTableTest_button'
          style={{ marginLeft: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJobId(params.row.id);
            setIsDeleteModalVisible(true);
          }}
          >
            Delete
          </button>}
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
      <Paper elevation={12}>
        <DataGrid
          rows={formattedJobs}
          columns={desktopColumns}
          sx={{ display: 'flex', flexDirection: 'column'}}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          hideFooter={true}
          loading={isDataLoading}
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
        />
      </Paper>
    </>

  );
}
export default MuiTableTest;
