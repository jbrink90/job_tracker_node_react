export function getJobHeaders() {
  return [
    {
      accessor: "company",
      label: "Company",
      isFilterable: true,
      isSortable: true,
      width: 200,
    },
    {
      accessor: "job_title",
      label: "Job Title",
      isFilterable: true,
      isSortable: true,
      width: 200,
    },
    {
      accessor: "description",
      label: "Description",
      isFilterable: true,
      isSortable: true,
      width: 300,
    },
    {
      accessor: "location",
      label: "Location",
      isFilterable: true,
      isSortable: true,
      width: 200,
    },
    {
      accessor: "status",
      label: "Status",
      isFilterable: true,
      isSortable: true,
      width: 150,
    },
    {
      accessor: "applied",
      label: "Applied",
      isFilterable: true,
      isSortable: true,
      type: "date",
    },
    {
      accessor: "last_updated",
      label: "Last Updated",
      isFilterable: true,
      isSortable: true,
      type: "date",
    },
  ];
}
