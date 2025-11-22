const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

connectDB();

app.use(express.json({ extended: false }));

app.use(
   cors({
      origin: ["*", "https://clockman.onrender.com", "http://localhost:3000", "chrome-extension://eahecleonfdkhfobcffggofaeoedliaa"],
   })
);

app.use("/userauth", require("./routes/userauth"));
app.use("/urltrack", require("./routes/urltrack"));
app.use("/usersession", require("./routes/usersession"));
app.use("/stats", require("./routes/stats"));
app.use("/urlcategory", require("./routes/urlcategory"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
