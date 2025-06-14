require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId, MongoExpiredSessionError } = require('mongodb');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const port = process.env.port || 3000;

// middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'unauthorized access' })
        };
        req.decoded = decoded;

    })

    next();
}


const verifyEmailToken = (req, res, next) => {
    if (req.query.email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' })
    };
    next();
}







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
        const bookingsCollection = client.db('athleticHubDB').collection('bookings')



        // JWT jot token
        app.post('/jwt', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false
            })
            res.send({ success: true });

        })

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        app.get('/allEvents', async (req, res) => {
            const result = await eventsCollection.find().toArray();
            res.send(result);
        })

        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await eventsCollection.findOne(query);
            res.send(result)
        });

        // my posted events
        app.get('/events', verifyToken, verifyEmailToken, async (req, res) => {
            const email = req.query.email;
            const query = { hr_email: email };
            const result = await eventsCollection.find(query).toArray();
            res.send(result);
        });

        // add event by HR or ADMIN
        app.post('/allEvents', async (req, res) => {
            const eventInfo = req.body;
            const result = await eventsCollection.insertOne(eventInfo);
            res.send(result)
        });


        // update event by HR/ADMIN
        app.put('/events/:id', async (req, res) => {
            const updatedEvent = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set:
                    updatedEvent

            };
            const options = { upsert: true };
            const result = await eventsCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        });


        // delete event by HR/ADMIN
        app.delete('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await eventsCollection.deleteOne(query);
            res.send(result);
        })


        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



        //  BOOKINGs

        app.get('/bookings', verifyToken, verifyEmailToken, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const bookings = await bookingsCollection.find(query).toArray();


            for (let booking of bookings) {
                const eventId = booking.eventId;
                const eventQuery = { _id: new ObjectId(eventId) };
                const event = await eventsCollection.findOne(eventQuery);

                booking.type = event.type;
                booking.eventName = event.eventName;
                booking.image = event.image;

            }
            res.send(bookings);
        })


        //book event 
        app.post('/bookings', async (req, res) => {
            const eventBookingData = req.body;
            const result = await bookingsCollection.insertOne(eventBookingData)
            res.send(result)

        })

        // delete bookings
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        })



        app.get('/events/:id',verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { eventId: id }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
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