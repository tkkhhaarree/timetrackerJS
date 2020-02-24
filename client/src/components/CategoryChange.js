import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog(props) {
   const openStatus = props.openStatus;
   const resetTable = props.resetTable;

   const url = props.dialogUrl;
   const category = props.dialogCategory;

   const [open, setOpen] = useState(openStatus);
   const [selectedCategory, setSelectedCategory] = useState(category);

   const handleClose = () => {
      setOpen(false);
   };

   const handleSelectChange = e => {
      setSelectedCategory(e.target.value);
   };

   const handleSubmit = () => {
      const token = localStorage.getItem("token");

      const config = {
         headers: {
            "x-auth-token": token,
            "Content-Type": "application/json"
         }
      };

      const body = JSON.stringify({
         url: url,
         vote: selectedCategory
      });

      axios.post("htp://localhost:5000/urlcategory", body, config).then(res => {
         if (res) {
            setOpen(false);
         } else {
            console.log("error in request for changing category.");
         }
      });

      resetTable(url, selectedCategory);
      setOpen(false);
   };

   return (
      <div>
         <Dialog
            open={openStatus}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
         >
            <DialogTitle id="form-dialog-title">Change category</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Currently, The URL: {url} is set as{" "}
                  {category == 1
                     ? "Productive"
                     : category == 0
                     ? "Neutral"
                     : "Distracting"}
                  .
               </DialogContentText>
               <Select value={selectedCategory} onChange={handleSelectChange}>
                  <MenuItem value={1}>Productive</MenuItem>
                  <MenuItem value={0}>Neutral</MenuItem>
                  <MenuItem value={-1}>Distracting</MenuItem>
               </Select>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleSubmit} color="primary">
                  Set
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
