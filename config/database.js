import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.MONGO_DB || 'lab11';

let db;

/**
 * @returns {Promise<Db>}
 */
async function connectToDatabase() {
	if (db) return db;

	try {
		const client = new MongoClient(MONGO_URI);
		const connection = await client.connect();
		db = connection.db(DATABASE_NAME);
		return db;
	} catch (error) {
		console.error(error);
	}
}

async function closeDatabase() {
	if (db) {
		await db.close();
	}
}

export { connectToDatabase, closeDatabase };
