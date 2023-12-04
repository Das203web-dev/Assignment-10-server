const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ipxrBu4H0pauZSGr
// shuvojit


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.etnbh8i.mongodb.net/?retryWrites=true&w=majority`;
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
        const brandCollection = database.collection("brands");
        const cart = database.collection("cart")
        app.get('/addProduct', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.put('/addProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const product = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    brand: product.brand,
                    carType: product.car,
                    description: product.description,
                    image: product.image,
                    name: product.name,
                    price: product.price,
                    rating: product.rating
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        // app.get('/addProduct/:brand', async (req, res) => {
        //     const brandName = req.params.brand;
        //     const query = { brand: brandName }
        //     const products = productCollection.findOne(query);
        //     res.send(products)

        // })
        app.get('/carDetails/:id', async (req, res) => {
            const carID = req.params.id;
            const query = { _id: new ObjectId(carID) }
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.post('/myCart', async (req, res) => {
            const cartProduct = req.body;
            // console.log(cartProduct);
            const result = await cart.insertOne(cartProduct);
            res.send(result)
        })
        app.get("/myCart", async (req, res) => {
            const cartData = cart.find();
            const result = await cartData.toArray();
            res.send(result)
        })
        app.get("/brandPage/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result)
        })
        app.delete('/myCart/:id', async (req, res) => {
            const deleteProductId = req.params.id;
            const query = { _id: new ObjectId(deleteProductId) }
            const result = await cart.deleteOne(query);
            res.send(result)
        })
        app.get("/update", async (req, res) => {
            const updateProduct = req.body;
            const result = await updateProduct.toArray()
            res.send(result)

        })

        app.get('/brandPage', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

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