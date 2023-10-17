const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



// middlieware

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Cofee making server is running')
})
app.listen(port, () => {
  console.log(`Coffee Server is on port: ${port}`)
})
