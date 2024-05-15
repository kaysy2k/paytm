const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(cors());
//2. Add body-parser
//Since we have to support the JSON body in post requests, 
//add the express body parser middleware to backend/index.js
//You can use the body-parser npm library, or use express.json 
app.use(express.json());
app.use("/api/v1", rootRouter);
app.listen(3000, () => {
    console.log("Server started on port 3000")

});