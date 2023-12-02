const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ipxrBu4H0pauZSGr
// shuvojit


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://shuvojit:ipxrBu4H0pauZSGr@cluster0.etnbh8i.mongodb.net/?retryWrites=true&w=majority";

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
        const database = client.db("automotiveDB");
        const productCollection = database.collection("products");
        const brandCollection = database.collection("brands")
        app.get('/addProduct', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/brandPage', async (req, res) => {
            // const brand = req.params.brandName;
            // const query = { brand: new ObjectId(brand) }

            const cursor = brandCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        // app.get("/brandPage/:brandName", async (req, res) => {
        //     const brand = req.params.brandName;
        //     console.log(brand)
        //     const query = { brandName: new ObjectId(brand) }
        //     const result = brandCollection.findOne(brand);
        //     const final = await result.toArray()
        //     res.send(final)
        // })
        app.post('/brandPage', async (req, res) => {
            const brands = req.body;
            console.log(brands)
            const result = await brandCollection.insertOne(brands);
            res.send(result)
        })

        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            console.log(product)
            const result = await productCollection.insertOne(product);
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


app.get("/", (req, res) => {
    res.send("server connected succcessfully")
})

app.listen(port, () => {
    console.log(`port is running on ${port}`)
})