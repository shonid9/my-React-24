import React from "react";
import { Box, Typography, CardMedia } from "@mui/material";

const AdminCRM = () => {
  return (
    <Box>
      <Typography variant="h3" textAlign={"center"} m={3}>
        <Typography variant="span" color="primary">
          CRM system {""}
        </Typography>
        is in progress
      </Typography>
      <CardMedia
        title="this page is in progress"
        component="img"
        alt="this page is in progress"
        image=" https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
      />
    </Box>
  );
};

export default AdminCRM;
