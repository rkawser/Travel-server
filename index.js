const express =require('express')
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId= require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const port  = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hahmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
       const database =client.db('travel_project');
       const travelConnection= database.collection('travels');

    //    api post
       app.post('/travels',async(req,res)=>{
              const service = req.body
              const result = await travelConnection.insertOne(service)
              console.log('product is going',result);
              res.json(result)
       })

    //    api load
       app.get('/travels',async(req,res)=>{             
        const cursor = travelConnection.find({})
        const result = await cursor.toArray();
        res.send(result)

       })

       //load single service

       app.get('/travels/:id',async(req,res)=>{
           const id = req.params.id;
           const query ={_id:ObjectId(id)}
           const result = await travelConnection.findOne(query)
           res.json(result)
       })


    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Hello form node mongodb')
})


app.listen(port,()=>{
    console.log('server is running',port);
})