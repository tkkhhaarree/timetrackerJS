const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");

connectDB();

app.use(express.json({ extended: false }));

app.use("/userauth", require("./routes/userauth"));
app.use("/urltrack", require("./routes/urltrack"));
app.use("/usersession", require("./routes/usersession"));
app.use("/stats", require("./routes/stats"));
app.use("/urlcategory", require("./routes/urlcategory"));

if (process.env.NODE_ENV === "production") {
   app.use(express.static("client/build"));

   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
