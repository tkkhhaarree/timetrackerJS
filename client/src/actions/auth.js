import axios from "axios";

export const login = async (email, password) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });
  const res = await axios.post(
    "http://localhost:5000/userauth/login",
    body,
    config
  );
  console.log("tok: ", res.data);
  return res.data;
};
