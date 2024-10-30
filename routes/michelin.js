import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

const getMichelinCollection = async () => {
	const db = await connectToDatabase();
	return db.collection('michelin');
};

router.get('/', async (req, res) => {
	const collection = await getMichelinCollection();
	const limit = parseInt(req.query.limit, 10) || 5;
	const michelins = await collection.find().limit(limit).toArray();
	res.status(200).send(michelins);
});

router.get('/countByCountry', async (req, res) => {
	const collection = await getMichelinCollection();
	const countByCountry = await collection
		.aggregate([
			{ $group: { _id: '$country', count: { $sum: 1 } } },
			{ $project: { _id: 0, country: '$_id', count: 1 } },
		])
		.toArray();
	res.status(200).send(countByCountry);
});

router.get('/noChefField', async (req, res) => {
	const collection = await getMichelinCollection();
	const michelins = await collection
		.find({ chef: { $exists: false } })
		.toArray();
	res.status(200).send(michelins);
});

router.get('/chineseInLondon', async (req, res) => {
	const collection = await getMichelinCollection();
	const michelins = await collection
		.find({ cuisine: 'Chinese', city: 'London' })
		.toArray();
	res.status(200).send(michelins);
});

router.get('/creativeAndInnovative', async (req, res) => {
	const collection = await getMichelinCollection();
	const michelins = await collection
		.find({ cuisine: { $all: ['Creative', 'Innovative'] } })
		.toArray();
	res.status(200).send(michelins);
});

router.get('/thaiCuisineNotInThailand', async (req, res) => {
	const collection = await getMichelinCollection();
	const michelins = await collection
		.find({ cuisine: 'Thai', country: { $ne: 'Thailand' } })
		.toArray();
	res.status(200).send(michelins);
});

router.get('/top10Cuisines', async (req, res) => {
	const collection = await getMichelinCollection();
	const top10Cuisines = await collection
		.aggregate([
			{ $unwind: '$cuisine' },
			{ $group: { _id: '$cuisine', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 },
			{ $project: { _id: 0, cuisine: '$_id', count: 1 } },
		])
		.toArray();
	res.status(200).send(top10Cuisines);
});

router.get('/thailandWithStreetFoodOrStars3', async (req, res) => {
	const collection = await getMichelinCollection();
	const michelins = await collection
		.find({
			country: 'Thailand',
			$or: [{ cuisine: 'Street Food' }, { stars: 3 }],
		})
		.toArray();
	res.status(200).send(michelins);
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	if (!ObjectId.isValid(id)) return res.status(400).send('Invalid ID format');

	const collection = await getMichelinCollection();
	const michelin = await collection.findOne({ _id: new ObjectId(id) });
	if (!michelin) return res.status(404).send('Not found');

	res.status(200).send(michelin);
});

router.get('/country/:country', async (req, res) => {
	const { country } = req.params;
	const collection = await getMichelinCollection();
	const michelins = await collection.find({ country }).toArray();
	res.status(200).send(michelins);
});

router.get('/cuisine/:cuisine', async (req, res) => {
	const { cuisine } = req.params;
	const collection = await getMichelinCollection();
	const michelins = await collection.find({ cuisine }).toArray();
	res.status(200).send(michelins);
});

router.get('/cuisine2/:cuisine', async (req, res) => {
	const { cuisine } = req.params;
	const stars = req.query.stars ? parseInt(req.query.stars, 10) : null;

	const collection = await getMichelinCollection();
	const query = { cuisine };
	if (stars !== null) query.stars = stars;

	const michelins = await collection.find(query).toArray();
	res.status(200).send(michelins);
});

export default router;
