import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./actions/auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
    </Router>
  );
}

const Home = () => {
  let token = localStorage.getItem("token");
  if (token) {
    return (
      <div>
        you are already logged in!.
        <br />
        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        you are not logged in.
        <br />
        <Link to="/login">
          <button>Login button</button>
        </Link>
      </div>
    );
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
