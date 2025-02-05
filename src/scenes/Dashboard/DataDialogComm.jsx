import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Button,
} from "@mui/material";

const DataDialogComm = ({
  openDialog,
  handleCloseDialog,
  selectedcategory,
  columns,
  rows,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="lg"
      fullWidth={true}
      sx={{
        borderRadius: "10px",
        boxShadow: 24,
      }}
    >
      <DialogTitle
        sx={{
          backgroundImage:
            "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {selectedcategory}
      </DialogTitle>

      <DialogContent sx={{ padding: "16px" }}>
        <Box sx={{ marginBottom: "20px" }}></Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: "8px" }}>
          <Table aria-label="data-table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: "#f5f5f5",
                      fontSize: "14px",
                      borderBottom: "2px solid #1976d2",
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ "&:hover": { backgroundColor: "#e8f0fe" } }}
                  >
                    <TableCell>{row.siteId}</TableCell>
                    <TableCell>{row.statusType}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.cellsConnectedCount}</TableCell>
                    <TableCell>{row.stringVoltage}</TableCell>
                    <TableCell>{row.instantaneousCurrent}</TableCell>
                    <TableCell>{row.ambientTemperature}</TableCell>
                    <TableCell>{row.batteryRunHours}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: "20px" }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button onClick={handleCloseDialog} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataDialogComm;
