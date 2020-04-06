import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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

export default function FullWidthTabs() {
   const classes = useStyles();
   const theme = useTheme();
   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
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
               <Tab label="Item One" />
               <Tab label="Item Two" />
               <Tab label="Item Three" />
            </Tabs>
         </AppBar>

         <TabPanel value={value} index={0} dir={theme.direction}>
            Item One
         </TabPanel>
         <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
         </TabPanel>
         <TabPanel value={value} index={2} dir={theme.direction}>
            Item Three
         </TabPanel>
      </div>
   );
}
