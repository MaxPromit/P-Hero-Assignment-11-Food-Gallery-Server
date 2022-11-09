const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 4000;
require("dotenv").config();

// middlewear 

app.use(cors());
app.use(express.json());

// mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofikfyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("foodGalleryUser").collection("services");
        const reviewsCollection = client.db("foodGalleryUser").collection("reviews");

        app.get('/limit/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get('/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
        app.post('/reviews', async(req,res)=>{
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err => console.error(err))


app.get("/", (req, res) => {
    res.send("Food Gallery Server Is Running");
  });
  
  app.listen(port, () => {
    console.log("Food Gallery Server Is Running On", port);
  });
  