import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import mock_response from "../../__mocks__/all_response.json";
import { ReactNode } from "react";
import "../ReactTable/index.css";
import "@fontsource/roboto/400.css"; // Specify weight if needed

function actionButtons(): ReactNode {
  return (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
      <button className="reactTracker_editButton"></button>
      <button className="reactTracker_delButton"></button>
    </div>
  );
}

const columns: GridColDef[] = [
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: actionButtons,
  },
  { field: "id", headerName: "ID", width: 30, type: "number" },
  { field: "company", headerName: "Company", width: 200 },
  { field: "job_title", headerName: "Position", width: 200 },
  {
    field: "description",
    headerName: "Description",
    width: 400,
  },
  {
    field: "location",
    headerName: "Location",
    width: 120,
  },
  { field: "status", headerName: "Status", width: 150 },
  {
    field: "applied",
    headerName: "Date Applied",
    width: 100,
    type: "date",
    valueFormatter: (date) => new Date(date).toLocaleDateString(),
  },
  {
    field: "last_updated",
    headerName: "Last Updated",
    width: 100,
    type: "date",
    valueFormatter: (date) => new Date(date).toLocaleDateString(),
  },
];

function MuiTableTest() {
  return (
    <Paper elevation={12}>
      <DataGrid rows={mock_response} columns={columns} sx={{ display: 'flex', flexDirection: 'column'}} />
    </Paper>
  );
}
export default MuiTableTest;
