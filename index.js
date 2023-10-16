const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



// middlieware

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.epdvwuc.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection('coffee');
    const userCollection = client.db("coffeeDB").collection('user');

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray();
      res.send(result)

    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })



    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })



    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedCoffee = req.body
      const coffee = {
        $set: {
          coffee: updatedCoffee.coffee,
          quality: updatedCoffee.quality,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    })



    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })


    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result)

    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user)
      const users = await userCollection.insertOne(user);
      res.send(users)
    })
    app.patch('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); 
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Cofee making server is running')
})
app.listen(port, () => {
  console.log(`Coffee Server is on port: ${port}`)
})
