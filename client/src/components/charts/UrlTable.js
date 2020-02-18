import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const UrlTable = props => {
   var tableData = props.tableData;

   var int = 0;
   function addInt() {
      int = int + 1;
      return int;
   }
   if (tableData != null) {
      var tableRow = tableData.map(row => {
         return (
            <TableRow key={row.url + addInt()}>
               <TableCell component="th" scope="row">
                  {row.url}
               </TableCell>
               <TableCell align="right">{row.time}</TableCell>
               <TableCell align="right">{row.category}</TableCell>
            </TableRow>
         );
      });
   }

   return (
      <TableContainer component={Paper}>
         <Table size="small" aria-label="a dense table">
            <TableHead>
               <TableRow>
                  <TableCell>
                     <b>URL</b>
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
   );
};

export default UrlTable;
