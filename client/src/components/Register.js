import React, { Component } from "react";
import { auth } from "../actions/auth";
import Link from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

class Register extends Component {
   constructor() {
      super();
      this.state = {
         username: "",
         email: "",
         password: "",
         open: false,
         alert: "",
      };
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
   }

   onChange(e) {
      this.setState({ [e.target.name]: e.target.value });
   }

   onSubmit(e) {
      e.preventDefault();
      const user = {
         username: this.state.username,
         email: this.state.email,
         password: this.state.password,
      };

      auth.register(user).then((res) => {
         if (res) {
            this.setState({ open: false });
            window.open("/dashboard/daily", "_self");
         } else {
            this.setState({ open: true });
            this.setState({
               alert:
                  "Invalid Email / Password format or Account already exists.",
            });
            setTimeout(() => {
               this.setState({ open: false });
            }, 3000);
         }
      });
   }

   render() {
      return (
         <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={paper}>
               <Avatar style={{ backgroundColor: "#ffffff" }}>
                  <LockOutlinedIcon color="secondary" />
               </Avatar>
               <Typography component="h1" variant="h5">
                  Sign up
               </Typography>
               <form
                  noValidate
                  onSubmit={this.onSubmit}
                  style={form}
                  spellCheck="false"
               >
                  <TextField
                     variant="outlined"
                     margin="normal"
                     required
                     fullWidth
                     id="username"
                     type="username"
                     label="Username"
                     name="username"
                     autoComplete="username"
                     autoFocus
                     value={this.state.username}
                     onChange={this.onChange}
                     color="secondary"
                  />

                  <TextField
                     variant="outlined"
                     margin="normal"
                     required
                     fullWidth
                     id="email"
                     type="email"
                     label="Email Address"
                     name="email"
                     autoComplete="email"
                     value={this.state.email}
                     onChange={this.onChange}
                     color="secondary"
                  />

                  <TextField
                     variant="outlined"
                     margin="normal"
                     required
                     fullWidth
                     name="password"
                     label="Password"
                     type="password"
                     name="password"
                     id="password"
                     autoComplete="current-password"
                     value={this.state.password}
                     onChange={this.onChange}
                     color="secondary"
                  />

                  <Button
                     type="submit"
                     fullWidth
                     variant="contained"
                     color="secondary"
                     style={submit}
                  >
                     Sign Up
                  </Button>
                  <Link href="/login" variant="body2">
                     Already have an account? Sign In
                  </Link>
               </form>
               <Snackbar open={this.state.open}>
                  <Alert variant="filled" severity="error">
                     {this.state.alert}
                  </Alert>
               </Snackbar>
            </div>
         </Container>
      );
   }
}

const paper = {
   marginTop: "30px",
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
};

const avatar = {
   margin: 1,
   backgroundColor: "#1872cc",
};

const form = {
   width: "100%", // Fix IE 11 issue.
   marginTop: 1,
};
const submit = {
   margin: "8px 0px 2px",
};

export default Register;
