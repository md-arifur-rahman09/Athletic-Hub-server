require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { populate } = require('dotenv');

const port = process.env.port || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());










const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n1yvnuo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        // DB collection
        const eventsCollection = client.db('athleticHubDB').collection('events');


        app.get('/allEvents', async (req, res) => {
            const result = await eventsCollection.find().toArray();
            res.send(result);
        })

        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await eventsCollection.findOne(query);
            res.send(result)
        })

        app.post('/allEvents', async (req, res) => {
            const eventInfo = req.body;
            const result = await eventsCollection.insertOne(eventInfo);
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
    res.send('hello athletic hub')
})

app.listen(port, () => {
    console.log(`my port is ${port}`)
})