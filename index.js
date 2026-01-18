// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@mohyminulislam.uwhwdlk.mongodb.net/?appName=Mohyminulislam`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("Nexfy");
    const productsCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      try {
        const query = {};
        const result = await productsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });
    // Featured products
    app.get("/featured", async (req, res) => {
      try {
        const query = {};
        const result = await productsCollection.find(query).limit(8).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });
    // discounted apis
    app.get("/discounted", async (req, res) => {
      try {
        const query = {
          $expr: { $gt: ["$originalPrice", "$price"] },
        };

        const result = await productsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });
    // products details with id
    app.get("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("Hello Admin! ✅");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running : ${port}`);
});
