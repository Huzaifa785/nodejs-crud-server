import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';

const app = express()
const mongoClient = mongodb.MongoClient
const url = "mongodb://localhost:27017"

const PORT = process.env.PORT || 5000

app.use(bodyParser())

app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    res.send('Hello from home page')
})

app.get('/list-products', async (req, res) => {
    try {
        // Connect DB
        let client = await mongoClient.connect(url)

        // Select DB
        let db = client.db("crud-dashboard-db")

        // Select collection and perform operations
        let data = await db.collection("products").find({}).toArray()

        // Close connection
        await client.close()

        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.post('/create-product', async (req, res) => {
    try {
        // Connect DB
        let client = await mongoClient.connect(url)

        // Select DB
        let db = client.db("crud-dashboard-db")

        // Select Collection & Perform Operation(s)
        let data = await db.collection("products").insertOne(req.body)

        // Close Connection
        await client.close()

        res.json({
            message: "Product Created!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.put('/update-product/:id', async (req, res) => {
    try {
        // Connect DB
        let client = await mongoClient.connect(url)

        // Select DB
        let db = client.db("crud-dashboard-db")

        // Select Collection & Perform Operation(s)
        let data = await db.collection("products")
            .findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body })

        // Close Connection
        await client.close()

        res.json({
            message: "Product Updated!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`)
})