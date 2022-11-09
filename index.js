const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleWare 
app.use(cors());
app.use(express.json());


const uri = 'mongodb+srv://greenConsult:otDJMFWb89g2DAcT@cluster0.qj1nhmw.mongodb.net/?retryWrites=true&w=majority';
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('greenConsult').collection('services');
        const reviewCollection = client.db('greenConsult').collection('reviews');

        // get maximum 3 service 
        app.get('/', async (req, res) => {
            const query = {};
            const size = 3;
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(size).toArray();
            res.send(services);
        })

        // get all services 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // get individual service details 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // post review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })



    }
    finally {

    }
}
run().catch(error => console.log(error))



app.get('/', (req, res) => {
    res.send('green-consult server is running')
})

app.listen(port, () => {
    console.log(`green-consult server is running on port: ${port}`)
})