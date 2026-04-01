import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB ?? 'social-app';

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Re-use the client across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

const client: MongoClient = global._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== 'production') {
  global._mongoClient = client;
}

export async function getDb(): Promise<Db> {
  await client.connect();
  return client.db(dbName);
}

export { client };
