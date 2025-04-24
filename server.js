const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const mongoURI = "mongodb://127.0.0.1:27017/blogDB";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const blogRoutes = require("./routes/blogRoutes");
app.use("/api", blogRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 5000;
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
});
