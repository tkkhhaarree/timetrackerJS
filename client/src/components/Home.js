import "./vendor/bootstrap/css/bootstrap.min.css";
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./vendor/animate/animate.css";
import "/vendor/css-hamburgers/hamburgers.min.css";
import "./vendor/select2/select2.min.css";
import "./css/util.css";
import "./css/main.css";

const Home = () => {
  let token = localStorage.getItem("token");
  if (auth.isAuthenticated === true && token != null) {
    return (
        <div className="limiter">
        <div className="container-login100">
        <font color="white">you are already logged in!.</font>
        <br />
        <Link to="/dashboard">
          <div className="container-login100-form-btn">
            <button className="login100-form-btn">Dashboard</button>
          </div>
        </Link>
      </div>
      </div>
    );
  } else {
    return (
        <div className="limiter">
        <div className="container-login100">
        <font color="white">you are not logged in.</font>
        <br />
        <Link to="/login">
          <div className="container-login100-form-btn">
            <button className="login100-form-btn">Login button</button>
          </div>
        </Link>
      </div>
      </div>
    );
  }
};

export default Home;