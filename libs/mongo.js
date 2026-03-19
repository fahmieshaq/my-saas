import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;
let clientPromise;

// NODE_ENV is an environment variable added by Next.js by default. We use
// it to determine the environment (development on your computer or
// production on your server)
if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global;
  globalWithMongo._mongoClientPromise = undefined;

  // Keeps the connection open all the time everytime our local server reloads after every change we make
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
