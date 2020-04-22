import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "axios";

export default function CategoryChange(props) {
   const defaultSelected = props.category;
   const url = props.url;
   const dialogOpen = props.dialogOpen;

   const changeTable = props.changeTable;
   const changeCancel = props.changeCancel;

   const [open, setOpen] = React.useState(dialogOpen);
   const [selected, setSelected] = useState(defaultSelected);
   const [displayUrl, setDisplayUrl] = useState(url);

   const handleChange = (e) => {
      setSelected(e.target.value);
   };

   const DialogFunc = () => {
      setOpen(dialogOpen);
      setSelected(defaultSelected);
      setDisplayUrl(url);
   };

   useEffect(DialogFunc, [dialogOpen]);

   const handleClose = () => {
      setOpen(false);
      changeCancel();
   };

   const handleSubmit = () => {
      const token = localStorage.getItem("token");
      const config = {
         headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
         },
      };

      const body = JSON.stringify({
         url: url,
         vote: selected,
      });

      axios
         .post("http://localhost:5000/urlcategory/", body, config)
         .then((res) => {
            if (res) {
               changeTable(url, selected);
            }
         });
      setOpen(false);
   };

   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"sm"}
         >
            <DialogTitle id="form-dialog-title">Set Category</DialogTitle>
            <DialogContent>
               <DialogContentText>{displayUrl}</DialogContentText>

               <Select value={selected} onChange={handleChange}>
                  <MenuItem value={1}>Productive</MenuItem>
                  <MenuItem value={0}>Neutral</MenuItem>
                  <MenuItem value={-1}>Distracting</MenuItem>
               </Select>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="secondary">
                  Cancel
               </Button>
               <Button onClick={handleSubmit} color="secondary">
                  Submit
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
