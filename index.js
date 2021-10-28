const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()



const app = express()
const port = 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfsyp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
  try {
    await client.connect();
    // console.log("db connected")
    const database = client.db('ema-jhon');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    // Query for a movie that has the title 'Back to the Future'
   
   
    

    app.get('/products', async (req,res) =>{

      const query = {};
      const cursor =  productsCollection.find(query);
      
      const count = await cursor.count()
      const page = req.query.page
      const size = parseInt(req.query.size)

      if(page){
         products = await cursor.skip(page*size).limit(size).toArray()

      }
      else{
         products = await cursor.toArray()
      }
      res.send({
        products,
        count
      });
      
    })
    app.post('/products/bykeys', async (req,res) =>{
      // console.log("hitting post")
      const keys = req.body;
      const query = {key:{$in:keys}}
      const products = await productsCollection.find(query).toArray()
      // console.log(keys)
      res.json(products)

    })
    app.post('/orders', async (req,res) =>{
      
      const order= req.body;
      
      console.log(order)
      const result = await ordersCollection.insertOne(order)
      res.json(result)

    })


  
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server running')
  })
  
  app.listen(port, () => {
    console.log("listening to port", port)
  })