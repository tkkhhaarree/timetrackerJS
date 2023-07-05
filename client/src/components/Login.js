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

import Snackbar from "@material-ui/core/Snackbar";

class Login extends Component {
   constructor() {
      super();
      this.state = {
         email: "",
         password: "",
         open: false,
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
         email: this.state.email,
         password: this.state.password,
      };

      auth.login(user).then((res) => {
         if (res) {
            this.setState({ open: false });
            window.open("/dashboard/all", "_self");
         } else {
            this.setState({ open: true });
            setTimeout(() => {
               this.setState({ open: false });
            }, 3000);
         }
      });
   }

   render() {
      return (
         <div>
            <font color="red">
               <b>For demo: use Email: tarun@gmail.com and password: 123456</b>
            </font>
            <Container component="main" maxWidth="xs">
               <CssBaseline />
               <div style={paper}>
                  <Avatar style={{ backgroundColor: "#ffffff" }}>
                     <LockOutlinedIcon color="secondary" />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                     Sign in
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
                        id="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        Sign In
                     </Button>

                     <Link href="/register" variant="body2">
                        Don't have an account? Sign Up
                     </Link>
                  </form>
                  <Snackbar open={this.state.open}>
                     Invalid Login ID / Password
                  </Snackbar>
               </div>
            </Container>
         </div>
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

export default Login;
