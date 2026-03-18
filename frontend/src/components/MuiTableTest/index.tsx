import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "@fontsource/roboto/400.css";
import { Job } from "../../types/Job";
import React from "react";
import "./index.css";
import { useTheme, useMediaQuery } from "@mui/material";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";

interface ReactTableProps {
  selectedJobId: number | null;
  setSelectedJobId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSlideoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobs: Job[];
  deleteJob: (arg: number) => void;
  setIsAddingNewJob: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDataLoading: boolean;
  refreshTable?: () => void;
}

function applyChipsToStatus(params: GridRenderCellParams) {
  switch (params.value) {
    case "Applied":
      return <Chip label="Applied" color="primary" sx={{ height: 25 }} />;
      break;
    case "Interview Scheduled":
      return (
        <Chip label="Interview Scheduled" color="warning" sx={{ height: 25 }} />
      );
      break;
    case "Offer Received":
      return (
        <Chip label="Offer Received" color="success" sx={{ height: 25 }} />
      );
      break;
    case "Rejected":
      return <Chip label="Rejected" color="error" sx={{ height: 25 }} />;
      break;
    case "Not Selected":
      return <Chip label="Rejected" color="error" sx={{ height: 25 }} />;
      break;
    case "":
      return;
      break;
    default:
      return <Chip label={params.value} sx={{ height: 25 }} />;
      break;
  }
}

export const MuiTableTest: React.FC<ReactTableProps> = ({
  jobs,
  setIsSlideoutOpen,
  setIsAddingNewJob,
  setSelectedJobId,
  setIsDeleteModalVisible,
  isDataLoading,
  refreshTable,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      location: false,
      applied: false,
      last_updated: false,
    });

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      pageSize: 15,
      page: 0,
    });

  const desktopColumns: GridColDef[] = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "job_title",
      headerName: "Job Title",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params) => applyChipsToStatus(params),
    },
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
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      hideable: false,
      align: "center",
      width: isMobile ? 90 : 180,
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            variant={"contained"}
            sx={{ maxHeight: "30px", padding: "5px", borderRadius: "4px" }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJobId(params.row.id);
              setIsAddingNewJob(false);
              setIsSlideoutOpen(true);
            }}
          >
            Edit
          </Button>
          {!isMobile && (
            <Button
              color="error"
              variant={"contained"}
              sx={{
                maxHeight: "30px",
                padding: "5px",
                marginLeft: "10px",
                borderRadius: "4px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedJobId(params.row.id);
                setIsDeleteModalVisible(true);
              }}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  React.useEffect(() => {
    if (refreshTable) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [refreshTable]);

  const formattedJobs = jobs.map((job) => ({
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
          sx={{ display: "flex", flexDirection: "column" }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          pageSizeOptions={[10, 15, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isDataLoading}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
        />
      </Paper>
    </>
  );
};
export default MuiTableTest;
