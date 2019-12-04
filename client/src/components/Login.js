import React, { Component } from "react";
import { auth } from "../actions/auth";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./css/Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
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
      password: this.state.password
    };

    auth.login(user).then(res => {
      if (res) {
        this.props.history.push("/dashboard");
      }
    });
  }

  render() {
    return (
      <div className="Login">
        <form noValidate onSubmit={this.onSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <br />
          <label>Password</label>
          <input
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            type="password"
          />
          <br />
          <Button type="submit">Login</Button>
        </form>
      </div>
    );
  }
}

export default Login;
