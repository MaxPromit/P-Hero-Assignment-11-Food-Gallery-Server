const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 4000;
require("dotenv").config();

// middlewear

app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofikfyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'unauthorize'})
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'forbidden'})
    }
    req.decoded = decoded;
    next();
  })
}



async function run() {
  try {
    const serviceCollection = client
      .db("foodGalleryUser")
      .collection("services");
    const reviewsCollection = client
      .db("foodGalleryUser")
      .collection("reviews");


      app.post('/jwt', (req,res)=>{
        const user = req.body;
        const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        res.send({token})
        // console.log(user);
      })  

    app.get("/limit/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    app.get("/reviews",verifyJWT,async (req, res) => {
      const decoded = req.decoded;
      console.log(decoded);
      if(decoded.email !== req.query.email){
       return res.status(403).send({message: 'unauthorized user'})
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewsCollection.find(query).sort({date: -1});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await serviceCollection.insertOne(services);
      res.send(result);
    });
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      reviews.date = new Date();
      const result = await reviewsCollection.insertOne(reviews);
      res.send(result);
    });
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const message = req.body.message;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
            message: message
        }
      }
      const result = await reviewsCollection.updateOne(query,updatedDoc)
      res.send(result)

    });
    app.delete('/reviews/:id', async(req,res)=>{
        const id = req.params.id;
        // console.log(id);
        const query = {_id: ObjectId(id)};
        const result = await reviewsCollection.deleteOne(query)
        res.send(result)
    })
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Food Gallery Server Is Running");
});

app.listen(port, () => {
  console.log("Food Gallery Server Is Running On", port);
});
