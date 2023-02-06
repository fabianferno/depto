import { MongoClient } from 'mongodb'

// Connection URL
const client = new MongoClient(
  process.env.MONGO_DB_URL ||
    'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
)
const db = client.db(process.env.MONGO_DB_NAME || 'depto')

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
    let member = req.body
    console.log(member)
    let result = await db.collection('members').insertOne(member)

    res.status(200).json(result)
  } else if (req.method === 'GET') {
    // Handle any other HTTP method
    // let members = await db.collection('members').find({}).toArray()
    // console.log(members)

    res.status(200).json([
      '0x64574dDbe98813b23364704e0B00E2e71fC5aD17', // Fabian
      '0x71B43a66324C7b80468F1eE676E7FCDaF63eB6Ac', // Gabriel
    ])
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
