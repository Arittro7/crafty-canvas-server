const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wv413.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // coding start here
    const artCollections = client.db('ArtsDb').collection('arts');

    // for read data 
    app.get('/arts', async(req, res)=>{
        const cursor = artCollections.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    // for single data 
    app.get('/arts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id : new ObjectId(id)}
      const result = await artCollections.findOne(query);
      res.send(result);
      console.log(result);
    })
    //for create data 
    app.post('/arts', async(req, res)=>{
        const newArts = req.body;
        const result = await artCollections.insertOne(newArts);
        res.send(result);
    })
    // // fot delete data
    // app.delete(`/arts/:id`, async(req, res) => {
    //   const id = req.params.id;
    //   const query = { _id : new ObjectId(id)};
    //   const result = await artCollections.deleteOne(query);
    //   res.send(result);
    //   console.log(result);
    // })
    // // for update data 
    // app.put(`/arts/:id`, async(req, res)=>{
    //   const id = req.params.id;
    //   const filter = { _id : new ObjectId(id)};
    //   const options = { upsert: true };
    //   const update = req.body;
    //   const art = {
    //     $set: {
    //       image_url:update.image_url,
    //       item_name:update.item_name,
    //       subcategory_Name:update.subcategory_Name,
    //       price:update.price,
    //       rating:update.rating,
    //       stockStatus:update.stockStatus,
    //       description:update.description,
    //       customization:update.customization,
    //       // processing_time:update.processing_time
    //     }
    //   }
    //   const result =  await artCollections.updateOne(filter, art, options);
    //   res.send(result)
    // })
    // coding end here


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
  res.send('server is running to fetch crafty info')
})

app.listen(port, () =>{
  console.log(`Arittro server is connected on port :${port}`);
})