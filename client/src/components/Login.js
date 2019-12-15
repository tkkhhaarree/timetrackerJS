import React, { Component } from "react";
import { auth } from "../actions/auth";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

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
      <div>
        <form noValidate onSubmit={this.onSubmit}>
          <span>Member Login</span>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.onChange}
            />
            <span></span>
            <span>
              <i aria-hidden="true"></i>
            </span>
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.onChange}
            />
            <span></span>
            <span>
              <i aria-hidden="true"></i>
            </span>
          </div>

          <div className="container-login100-form-btn">
            <button type="submit" className="login100-form-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
