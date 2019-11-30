import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/Login";

export default function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

const Home = () => {
  return (
    <Link to="/login">
      <button>Login button</button>
    </Link>
  );
};
