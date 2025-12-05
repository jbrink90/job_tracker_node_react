import { useState, useEffect } from "react";
import { SimpleTable } from "simple-table-core";
import "simple-table-core/styles.css";

import { getJobHeaders } from "./job-headers";

export function JobTable({ data, theme = "dark" }: {
  data: any[];
  theme?: "light" | "dark";
}) {
  const [rows, setRows] = useState(data);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <div className={`job-table-container`}>
      <SimpleTable
        rows={rows}
        rowIdAccessor="id"
        defaultHeaders={getJobHeaders()}
        rowsPerPage={rowsPerPage}
        shouldPaginate
        filterIcon
        sortDownIcon
        sortUpIcon
        theme={theme}
      />
    </div>
  );
}
