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
      const userCollection = database.collection("user");


    //    api post
       app.post('/travels',async(req,res)=>{
              const service = req.body
              const result = await travelConnection.insertOne(service)
              console.log('product is going',result);
              res.json(result)
       })

       app.post("/userOrder", async(req, res)=>{
        const data = req.body;
        const result = await userCollection.insertOne(data);
        res.json(result)
    })
       app.get("/userOrder/:uid", async(req, res)=>{
        const uid = req.params.uid;
        const query = {userId:uid};
        console.log(uid);
        const result = await userCollection.find(query).toArray();
        console.log(result )
        res.send(result)
    })
       app.delete("/userOrder/:id/:uid", async(req, res)=>{
        const uid = req.params.uid;
        const id = req.params.id;
        const query = {userId:uid, _id:ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })
       app.put("/userOrder/:id/:uid", async(req, res)=>{
        const uid = req.params.uid;
        const id = req.params.id;
        const query = {userId:uid, _id:ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              status: "approved"
            },
          };
        const result = await userCollection.updateOne(query, updateDoc, options);
        res.send(result)
    })

    app.get("/allOrder", async(req,res)=>{
        const result = await userCollection.find({}).toArray();
        res.send(result)
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
    console.log(' assignment server is running',port);
})