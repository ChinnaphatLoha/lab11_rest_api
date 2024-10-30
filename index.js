import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import './config/dotenv.js';
import michelin from './routes/michelin.js';

const SERVER_PORT = process.env.SERVER_PORT || 5050;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/michelins', michelin);

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
