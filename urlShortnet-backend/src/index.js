const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors')
const router = require("./routes/route");
mongoose.set({ strictQuery: false });
const app = express();
app.use(cors())
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/urlShortner")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", router)
app.listen(3000, () => {
  console.log("server is running on PROT 3000");
});
