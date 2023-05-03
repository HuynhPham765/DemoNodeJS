const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { formatResponseUtil } = require('./utils/responseUtils')

const app = express()
const port = 3000

const uri = "mongodb+srv://UserAdmin:123qwe@clusterdemonodejs.bewxts9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);
app.use(express.json());

app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type)
    .status(statusCode)
    .send(message)
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/user', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DemoDB')
    const collection = db.collection('Users');
    const id = new ObjectId(req.query.id)
    const user = await collection.findOne({'_id': id})
    res.json(user)
  } catch (error) {
    res.status(500)
    res.send('Get Failed')
  } finally {
    await client.close();
  }
})

app.post('/user', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DemoDB')
    await db.collection('Users').insertOne(req.body);
    res.json({
      data: req.body,
      message: 'Add Successfully'
    })
  } catch (error) {
    res.status(500)
    res.send('Add Failed')
  } finally {
    await client.close();
  }
})

app.post('/user/update', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DemoDB')
    const id = new ObjectId(req.query.id)
    const filter = { _id: id };
    const options = { upsert: true };
    const updateDoc = {
      $set: req.body
    }
    const result = await db.collection('Users').updateOne(filter, updateDoc, options);
    if (result.modifiedCount > 0) {
      res.json({
        data: req.body,
        message: 'Update Successfully'
      })
    } else {
      throw ''
    }
  } catch (error) {
    res.status(500)
    res.send('Update Failed')
  } finally {
    await client.close();
  }
})

app.delete('/user', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DemoDB')
    const id = new ObjectId(req.query.id)
    const query = { _id: id };
    const result = await db.collection('Users').deleteOne(query);
    if (result.deletedCount === 1) {
      res.send('Delete Successfully')
    } else {
      throw ''
    }
  } catch (error) {
    res.status(500)
    res.send('Delete Failed')
  } finally {
    await client.close();
  }
})