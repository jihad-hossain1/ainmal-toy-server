const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8rkw6sl.mongodb.net/?retryWrites=true&w=majority`;

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
        
        const toysCollection = client.db('AnimalToy').collection('toys')
        const usersCollection = client.db('AnimalToy').collection('users')
        const toysReviewsCollection = client.db('AnimalToy').collection('toysReviews')
        const cartsCollection = client.db('AnimalToy').collection('carts')
        // const cartsDeleteCollection = client.db('Decabo').collection('carts')
        // const toysReviewsCollection = client.db('Decabo').collection('courseComment')

        // const serchCollection = client.db('Decabo').collection('course')
        // app.get('/getcourseId/:id')

        // const indexKeys = { title: 1, category: 1 };
        // const indexOptions = { category: "titleCategory" };
        // app.get("/getcourseText/:text", async (req, res) => {
        //     const text = req.params.text;
        //     const result = await serchCollection
        //         .find({
        //             $or: [
        //                 { title: { $regex: text, $options: "i" } },
        //                 { category: { $regex: text, $options: "i" } },
        //                 { date: { $regex: text, $options: "i" } },
        //             ],
        //         })
        //         .toArray();
        //     res.send(result);
        // });
         // user api
         app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query);
            const result = await cartsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });
         app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(query, updateDoc, options)
            // console.log(result);
            res.send(result)
        })
        // get all users 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })
        // get user single id 
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })
        app.get('/toys_by_email', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        })

        app.post("/toys", async (req, res) => {
            const doc = req.body;
            const result = await toysCollection.insertOne(doc);
            res.send(result);
        });
        //  collection api
        app.get("/toys", async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        });
        // add a 

        // get a single 
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result)
        })
        app.get('/toys/:email', async (req, res) => {
            const email = req.params.email;
            // const query = { _id: new ObjectId(id) }
            const result = await toysCollection.find(email)
            res.send(result)
        })
        // all geting card delete one by one
        app.delete("/toys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const item = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: item,
            }
            const result = await toysCollection.updateOne(filter, updateDoc, options)
            console.log(result);
            res.send(result)
        })
        // reviews api
        app.post("/reviews", async (req, res) => {
            const doc = req.body;
            const result = await toysReviewsCollection.insertOne(doc);
            res.send(result);
        });
        app.get("/reviews", async (req, res) => {
            const result = await toysReviewsCollection.find().toArray();
            res.send(result);
        });
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const result = await toysReviewsCollection.find(id)
            res.send(result)
        })
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const item = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: item,
            }
            const result = await toysReviewsCollection.updateOne(filter, updateDoc, options)
            // console.log(result);
            res.send(result)
        })
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysReviewsCollection.deleteOne(query);
            res.send(result);
        });
        // //  carts api
        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.findOne(query)
            res.send(result)
        })
        app.post("/carts", async (req, res) => {
            const doc = req.body;
            const result = await cartsCollection.insertOne(doc);
            res.send(result);
        });
        app.get("/allcarts", async (req, res) => {
            const result = await cartsCollection.find().toArray();
            res.send(result);
        });
         app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        });
        // app.get('/carts', async (req, res) => {
        //     let query = {};
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //     }
        //     const result = await cartsCollection.find(query).toArray();
        //     res.send(result)
        // })
      
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        });
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('animal_toy Server is Running');
})

app.listen(port, () => {
    console.log(`animal_toy Server run on port ${port}`);
})
