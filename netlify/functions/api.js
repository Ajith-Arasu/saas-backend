import express from 'express';
import serverless from 'serverless-http';
import { setRoutes } from '../../src/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setRoutes(app);

export const handler = serverless(app);
