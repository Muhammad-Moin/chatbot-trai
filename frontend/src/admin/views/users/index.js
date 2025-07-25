import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MainCard from "../../ui-component/cards/MainCard";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../../services/users";

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [page, setPage] = React.useState(1);

  // Component Mount fetch all configuration keys
  const { isLoading, data, isFetching, isError } = useQuery({
    queryKey: ["allUsers", page],
    queryFn: () => fetchAllUsers(page),
    staleTime: 10000,
  });

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    console.log(newRow);
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "username", headerName: "Username", flex: 1, editable: false },
    { field: "email", headerName: "Email", flex: 1, editable: false },
    { field: "first_name", headerName: "First name", flex: 1, editable: false },
    { field: "last_name", headerName: "Last name", flex: 1, editable: false },
    {
      field: "is_superuser",
      headerName: "Admin User",
      flex: 1,
      editable: false,
    },
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   headerName: 'Actions',
    //   flex: 1,
    //   align: 'right',
    //   headerAlign: 'right',
    //   cellClassName: 'actions',
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           key={`save-${id}`}
    //           icon={<SaveIcon />}
    //           label="Save"
    //           style={{ color: '#5e35b1' }}
    //           onClick={handleSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           key={`cancel-${id}`}
    //           icon={<CancelIcon />}
    //           style={{ color: '#ef8157' }}
    //           label="Cancel"
    //           onClick={handleCancelClick(id)}
    //         />
    //       ];
    //     }

    //     return [
    //       <GridActionsCellItem
    //         key={`edit-${id}`}
    //         icon={<EditIcon />}
    //         label="Edit"
    //         style={{ color: '#5e35b1' }}
    //         onClick={handleEditClick(id)}
    //       />,
    //       <GridActionsCellItem
    //         key={`delete-${id}`}
    //         icon={<DeleteIcon />}
    //         style={{ color: '#ef8157' }}
    //         label="Delete"
    //         onClick={handleDeleteClick(id)}
    //       />
    //     ];
    //   }
    // }
  ];

  if (isError)
    return (
      <MainCard>
        <Typography>Error Fetching Data</Typography>
      </MainCard>
    );

  return (
    <MainCard>
      <Typography variant="h2" style={{ fontWeight: "normal" }}>
        Select User to change
      </Typography>
      {isLoading && isFetching && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <CircularProgress size={35} style={{ color: "#5e35b1" }} />
        </Box>
      )}
      {!isLoading && !isFetching && (
        <DataGrid
          style={{ marginTop: 20 }}
          rows={data.results}
          loading={isLoading && isFetching}
          autoHeight
          columns={columns}
          // disableColumnResize
          // disableColumnMenu
          // editMode="row"
          // rowModesModel={rowModesModel}
          // onRowModesModelChange={handleRowModesModelChange}
          // onRowEditStop={handleRowEditStop}
          // processRowUpdate={processRowUpdate}
          // slotProps={{
          //   toolbar: { setRows, setRowModesModel },
          // }}
        />
      )}
    </MainCard>
  );
}
