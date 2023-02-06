import { MongoClient, ObjectId } from 'mongodb'

// Connection URL
const client = new MongoClient(
  process.env.MONGO_DB_URL ||
    'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
)
const db = client.db(process.env.MONGO_DB_NAME || 'depto')

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
    let patent = req.body
    // console.log(member)
    let result = await db.collection('patents').insertOne(patent)

    res.status(200).json(result)
  } else if (req.method === 'GET') {
    // Handle any other HTTP method
    const { _id } = req.query
    console.log(_id)
    let patent = await db.collection('patents').findOne({
      _id: new ObjectId(_id),
    })

    res.status(200).json(patent)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
