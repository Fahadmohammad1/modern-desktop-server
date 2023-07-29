require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qxyhrlo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(req, res) {
  try {
    await client.connect();
    const productCollection = client
      .db("productCollection")
      .collection("product");

    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();

      res.send({ message: "success", status: 200, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send({ message: "success", status: 200, data: product });
    });

    app.get("/category", async (req, res) => {
      const query = req.query.category;

      const products = await productCollection
        .find(query ? { category: { $regex: query, $options: "i" } } : {})
        .toArray();

      res.send({ message: "success", status: 200, data: products });
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
