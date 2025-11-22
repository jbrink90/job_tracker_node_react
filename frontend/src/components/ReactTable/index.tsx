import React from "react";
import dayjs from "dayjs";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";

// ---------------------------
// Row Type
// ---------------------------
export interface JobRow {
  id: number;
  company: string;
  job_title: string;
  description: string;
  location: string;
  status: string;
  applied?: string | null;
  last_updated?: string | null;

  onEdit: () => void;
  onDelete: () => void;
}

// ---------------------------
// Columns
// ---------------------------
const columns: GridColDef<JobRow>[] = [
  { field: "company", headerName: "Company", flex: 1 },
  { field: "job_title", headerName: "Position", flex: 1 },

  {
    field: "description",
    headerName: "Description",
    flex: 1,
    valueGetter: (params: GridValueGetterParams<JobRow>) => {
      const row = params.row;
      if (!row || !row.description) return "";
      return row.description.substring(0, 40);
    },
  },

  { field: "location", headerName: "Location", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },

  {
    field: "applied",
    headerName: "Applied",
    flex: 1,
    valueGetter: (params: GridValueGetterParams<JobRow>) =>
      params.row.applied
        ? dayjs(params.row.applied).format("MM/DD/YYYY")
        : "",
  },

  {
    field: "last_updated",
    headerName: "Last Update",
    flex: 1,
    valueGetter: (params: GridValueGetterParams<JobRow>) =>
      params.row.last_updated
        ? dayjs(params.row.last_updated).format("MM/DD/YYYY")
        : "",
  },

  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<JobRow>) => (
      <>
        <span
          style={{ marginRight: 10, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // ← modern fix
            params.row.onEdit();
          }}
        >
          <EditDocumentIcon sx={{ color: "#e1e1e1" }} />
        </span>

        <span
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // ← modern fix
            params.row.onDelete();
          }}
        >
          <DeleteIcon sx={{ color: "#e1e1e1" }} />
        </span>
      </>
    ),
  },
];


// ---------------------------
// Main Component
// ---------------------------
interface ReactTableProps {
  jobs: any[];
  slideIn: () => void;
  deleteJob: (index: number) => void;
  setSelectedJobIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ReactTable: React.FC<ReactTableProps> = ({
  jobs,
  slideIn,
  deleteJob,
  setSelectedJobIndex,
}) => {
  // Build typed rows
  const rows: JobRow[] = jobs.map((job, i) => ({
    id: i,
    ...job,

    onEdit: () => {
      setSelectedJobIndex(i);
      slideIn();
    },

    onDelete: () => {
      deleteJob(i);
    },
  }));

  return (
    <div style={{ height: "75vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          color: "#e1e1e1",
          background: "#303030",
        }}
      />
    </div>
  );
};

export default ReactTable;
