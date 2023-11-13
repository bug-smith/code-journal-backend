/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';
import { syncBuiltinESMExports } from 'module';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `select * from "entries"`;
    const results = await db.query(sql);
    res.json(results.rows);
  } catch (e) {
    next(e);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId <= 0) {
      throw new ClientError(400, `the EntryId is not acceptable ${res.status}`);
    }
    const sql = `select * from "entries" where "entryId" = $1`;
    const params = [entryId];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, `Entry doesnt exist, please try again!`);
    }
    res.json(entry);
  } catch (e) {
    next(e);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId <= 0) {
      throw new ClientError(400, 'entryId must be a positive integer');
    }
    const { photoUrl, notes, title } = req.body;
    if (!req.body || !photoUrl || !notes || !title) {
      console.log('req body is missing');
    }
    const sql = `update "entries" set "photoUrl" = $1, notes = $2, title = $3 where "entryId" = $4 returning *`;
    const params = [photoUrl, notes, title, entryId];
    const result = await db.query(sql, params);
    if (!result.rows) {
      throw new ClientError(400, 'there is no result');
    }
    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { photoUrl, title, notes } = req.body;
    const sql = `insert into "entries" ("photoUrl", title, notes)
    values ($1, $2, $3)
    returning *`;
    const params = [photoUrl, title, notes];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    const sql = `delete from "entries"
    where "entryId" = $1
    returning *`;
    const result = await db.query(sql, [entryId]);
    if (!result.rows[0]) {
      throw new ClientError(404, 'entry not found');
    }
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
