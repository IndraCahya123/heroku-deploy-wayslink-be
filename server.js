const express = require("express");
const router = require("./src/router/main-root");
const cors = require("cors");

require("dotenv").config();

const app = express();

const portServer = process.env.PORT || 5000;

// agar penggunaan express.json berjalan dengan baik, masih harus install body-parser
app.use(express.json());

app.use(cors());

app.use("/link-api/v1", router);

//home routes for testing if server side is running
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

app.use("/uploadedImages", express.static("uploadedImages"));

app.listen(portServer, () => console.log(`Your server is running at port:${portServer}`));