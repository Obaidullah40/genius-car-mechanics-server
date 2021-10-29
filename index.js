const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k92al.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get Single service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log("load service with id", id);
            res.send(service);
        });

        // post API
        app.post("/services", async (req, res) => {
            const service = req.body;
            console.log("hit the post api", service);
            const result = await servicesCollection.insertOne(service);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result);
        });

        // DELETE API
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            console.log("deleting user with id ", result);
            res.json(result);
        });
    }
    finally {
        // await client.close( );
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Running my Server");
});


app.get("/hello", (req, res) => {
    res.send("Running my hello");
});


app.listen(port, () => {
    console.log("Running Server on port", port);
});
