import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <Typography
         component="div"
         role="tabpanel"
         hidden={value !== index}
         id={`full-width-tabpanel-${index}`}
         aria-labelledby={`full-width-tab-${index}`}
         {...other}
      >
         {value === index && <Box p={3}>{children}</Box>}
      </Typography>
   );
}

const useStyles = makeStyles(theme => ({
   root: {
      backgroundColor: theme.palette.background.paper,
      width: 500
   }
}));

export default function IntervalChange(props) {
   const openState = props.open;
   const changeCancel = props.changeCancel;
   const [open, setOpen] = useState(openState);
   console.log("open interval: ", open);
   const [startDate, setStartDate] = useState(new Date());
   const [startMonth, setStartMonth] = useState(new Date());
   const [startYear, setStartYear] = useState("2020");
   const [displayBrDate, setDisplayBrDate] = useState("none");
   const [displayBrMonth, setDisplayBrMonth] = useState("none");

   const classes = useStyles();
   const theme = useTheme();
   const [value, setValue] = useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   const increaseDialogDate = () => {
      setDisplayBrDate("inline");
   };

   const decreaseDialogDate = () => {
      setDisplayBrDate("none");
   };

   const increaseDialogMonth = () => {
      setDisplayBrMonth("inline");
   };

   const decreaseDialogMonth = () => {
      setDisplayBrMonth("none");
   };

   const handleClose = () => {
      setOpen(false);
      changeCancel();
   };

   const handleSubmit = () => {
      setOpen(false);
      changeCancel();

      if (value == 0) {
         var m = startDate.getMonth() + 1;
         window.open(
            "/dashboard/daily/" +
               startDate.getDate() +
               "-" +
               m +
               "-" +
               startDate.getFullYear(),
            "_self"
         );
      }

      if (value == 1) {
         var m = startMonth.getMonth() + 1;
         window.open(
            "/dashboard/monthly/" + m + "-" + startMonth.getFullYear(),
            "_self"
         );
      }

      if (value == 2) {
         window.open("/dashboard/yearly/" + startYear, "_self");
      }
   };

   const changeDate = date => {
      setStartDate(date);
   };

   const changeMonth = date => {
      setStartMonth(date);
   };

   const changeYear = e => {
      setStartYear(e.target.value);
   };

   const DialogFunc = () => {
      setOpen(openState);
   };

   useEffect(DialogFunc, [openState]);

   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"sm"}
         >
            <DialogTitle id="form-dialog-title">
               Select time Interval
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  <div className={classes.root}>
                     <AppBar position="static" color="default">
                        <Tabs
                           value={value}
                           onChange={handleChange}
                           indicatorColor="primary"
                           textColor="primary"
                           variant="fullWidth"
                           aria-label="full width tabs example"
                        >
                           <Tab label="Day" />
                           <Tab label="Month" />
                           <Tab label="Year" />
                        </Tabs>
                     </AppBar>
                     <br />
                     <TabPanel value={value} index={0} dir={theme.direction}>
                        <DatePicker
                           onCalendarOpen={increaseDialogDate}
                           onCalendarClose={decreaseDialogDate}
                           popperPlacement="bottom-start"
                           selected={startDate}
                           onChange={changeDate}
                           showMonthDropdown
                           showYearDropdown
                           dropdownMode="select"
                        />
                     </TabPanel>
                     <TabPanel value={value} index={1} dir={theme.direction}>
                        <DatePicker
                           onCalendarOpen={increaseDialogMonth}
                           onCalendarClose={decreaseDialogMonth}
                           popperPlacement="bottom-start"
                           selected={startMonth}
                           onChange={changeMonth}
                           dateFormat="MM/yyyy"
                           showMonthYearPicker
                           style={{ marginLeft: 20 }}
                        />
                     </TabPanel>
                     <TabPanel value={value} index={2} dir={theme.direction}>
                        <br />
                        <Select
                           value={startYear}
                           onChange={changeYear}
                           style={{ marginLeft: 20 }}
                        >
                           <MenuItem value={"2019"}>2019</MenuItem>
                           <MenuItem value={"2020"}>2020</MenuItem>
                           <MenuItem value={"2021"}>2021</MenuItem>
                        </Select>
                     </TabPanel>
                  </div>
                  <div style={{ display: displayBrDate }}>
                     <br />
                     <br />
                     <br />
                     <br />
                     <br />
                     <br />
                     <br />
                     <br />
                  </div>

                  <div style={{ display: displayBrMonth }}>
                     <br />
                     <br />
                     <br />
                     <br />
                     <br />
                  </div>
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleSubmit} color="primary">
                  Submit
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
