const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

const port = process.env.PORT || 4000;
require("dotenv").config();

// middlewear 

app.use(cors());
app.use(express.json());

// mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofikfyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get("/", (req, res) => {
    res.send("Food Gallery Server Is Running");
  });
  
  app.listen(port, () => {
    console.log("Food Gallery Server Is Running On", port);
  });
  