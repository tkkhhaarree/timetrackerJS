const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

app.use("/userauth", require("./routes/userauth"));
app.use("/urltrack", require("./routes/urltrack"));
app.use("/usersession", require("./routes/usersession"));
app.use("/stats", require("./routes/stats"));
//app.use("/urlcategory", require("./routes/urlcategory"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
