import axios from "axios";
import jwt_decode from "jwt-decode";

const isValidToken = () => {
   const token = localStorage.getItem("token");

   if (token && isValid(token)) {
      return true;
   }

   return false;
};

const isValid = token => {
   const decoded = jwt_decode(token);

   const currentTime = Date.now() / 1000;

   if (currentTime > decoded.exp) {
      return false;
   }

   return true;
};

export const auth = {
   isAuthenticated: isValidToken(),

   register(user) {
      const config = {
         headers: {
            "Content-Type": "application/json"
         }
      };
      const body = JSON.stringify({
         name: user.username,
         email: user.email,
         password: user.password
      });
      return axios
         .post("http://localhost:5000/userauth/signup", body, config)
         .then(res => {
            localStorage.setItem("token", res.data.token);
            this.isAuthenticated = true;
            console.log("from auth: ", this.isAuthenticated);
            return res.data;
         })
         .catch(err => {
            this.isAuthenticated = false;
            console.log(err);
         });
   },

   login(user) {
      const config = {
         headers: {
            "Content-Type": "application/json"
         }
      };
      const body = JSON.stringify({
         email: user.email,
         password: user.password
      });

      return axios
         .post("http://localhost:5000/userauth/login", body, config)
         .then(res => {
            localStorage.setItem("token", res.data.token);
            this.isAuthenticated = true;
            console.log("from auth: ", this.isAuthenticated);
            return res.data;
         })
         .catch(err => {
            this.isAuthenticated = false;
            console.log(err);
         });
   },
   logout() {
      localStorage.removeItem("token");
   }
};
