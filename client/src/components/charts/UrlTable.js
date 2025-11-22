import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CategoryChange from "../CategoryChange";
import TablePagination from '@material-ui/core/TablePagination';

const UrlTable = (props) => {
   var tableData = props.tableData;
   const [tableState, setTableState] = useState();
   const [open, setOpen] = useState(false);
   const [dialogUrl, setDialogUrl] = useState();
   const [dialogCategory, setDialogCategory] = useState();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const updateState = () => {
      console.log("tablestate updated");
      setTableState(tableData);
   };

   const buttonClick = (url, category) => {
      setDialogUrl(url);
      setDialogCategory(category);
      setOpen(true);
   };

   const changeCancel = () => {
      setOpen(false);
   };

   const tableChange = (url, new_category) => {
      var i;
      for (i = 0; i < tableData.length; i++) {
         if (tableData[i].url == url) {
            tableData[i].category = new_category;
            break;
         }
      }
      console.log(url + "----" + new_category);
      setTableState(tableData);
      setOpen(false);
   };

   useEffect(updateState, [tableData]);

   var int = 0;
   function addInt() {
      int = int + 1;
      return int;
   }
   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const paginatedRows = tableState
      ? tableState.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];

   var tableRow = paginatedRows.map((row) => {
      return (
         <TableRow key={row.url + addInt()}>
            <TableCell
               style={{ borderBottom: "none" }}
               component="th"
               scope="row"
            >
               {row.url.length > 26
                  ? row.url.substring(0, 27) + " ..."
                  : row.url}
            </TableCell>
            <TableCell style={{ borderBottom: "none" }} align="right">
               {row.time}
            </TableCell>
            <TableCell style={{ borderBottom: "none" }} align="right">
               {row.category == -1
                  ? "Distracting "
                  : row.category == 0
                  ? "Neutral "
                  : "Productive "}
               <button
                  style={{
                     padding: 0,
                     border: "none",
                     background: "none",
                     fontSize: 11,
                     color: "blue",
                     outline: "none",
                  }}
                  onClick={() => buttonClick(row.url, row.category)}
               >
                  change
               </button>
            </TableCell>
         </TableRow>
      );
   });

   return (
      <div>
         <TableContainer>
            <Table size="small" aria-label="a dense table">
               <TableHead>
                  <TableRow style={{ borderBottomColor: "black" }}>
                     <TableCell>
                        <b>Name</b>
                     </TableCell>
                     <TableCell align="right">
                        <b>View Time</b>
                     </TableCell>
                     <TableCell align="right">
                        <b>Category</b>
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>{tableRow}</TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={tableState ? tableState.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
         />
         <CategoryChange
            url={dialogUrl}
            category={dialogCategory}
            dialogOpen={open}
            changeTable={tableChange}
            changeCancel={changeCancel}
         />
      </div>
   );
};

export default UrlTable;
