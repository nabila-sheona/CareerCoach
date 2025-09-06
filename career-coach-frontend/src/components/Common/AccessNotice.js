import React from "react";
import { Alert, Box, Container } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const AccessNotice = () => {
  return (
    <Box sx={{ bgcolor: "warning.light", py: 2 }}>
      <Container maxWidth="lg">
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            bgcolor: "transparent",
            color: "warning.dark",
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <strong>Limited Access:</strong> You're browsing as an anonymous user.
          Register to unlock CV review, aptitude tests, mock interviews, and
          progress tracking features.
        </Alert>
      </Container>
    </Box>
  );
};

export default AccessNotice;
