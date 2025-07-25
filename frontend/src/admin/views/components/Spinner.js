import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Spinner = ({ mutationFunc, spinnerSize }) => {
  return (
    <>
      {mutationFunc.isPending && (
        <Box
          sx={{
            position: "fixed",
            alignSelf: "center",
          }}
        >
          <CircularProgress
            size={spinnerSize}
            style={{ color: "var(--color-text)" }}
          />
        </Box>
      )}
    </>
  );
};

export default Spinner;
